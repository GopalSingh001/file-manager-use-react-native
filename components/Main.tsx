import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import RNFS, { ReadDirItem } from 'react-native-fs';

interface Folder {
  name: string;
  path: string;
}

const Main = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [currentPath, setCurrentPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<Folder[]>([]);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to work properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        getAllFolders(currentPath);
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const getAllFolders = async (path: string) => {
    try {
      const result: ReadDirItem[] = await RNFS.readDir(path);
      console.log('GOT RESULT', result);
      setFolders(result.map((item) => ({ name: item.name, path: item.path })));
    } catch (err) {
      console.log(err);
    }
  };

  const isFolder = (name: string): boolean => {
    const itsFolder = name.includes('.')
    return itsFolder
  };

  const createFolder = async () => {
    try {
      await RNFS.mkdir(`${currentPath}/${folderName}`);
      getAllFolders(currentPath);
    } catch (error) {
      console.log(error);
    }
  };

  const createFile = async () => {
    try {
      await RNFS.writeFile(`${currentPath}/${fileName}`, 'hello how are you', 'utf8');
      getAllFolders(currentPath);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDir = async (path: string) => {
    try {
      await RNFS.unlink(path);
      getAllFolders(currentPath);
    } catch (error) {
      console.log(error);
    }
  };


  
const renameItem = (path:string) => {
  Alert.prompt('Rename', 'Enter the new name:', (newName) => {
    if (newName !== null) {
      // Find the item with the provided path in the folders data
      const updatedFolders = folders.map((item) => {
        if (item.path === path) {
          return {
            ...item,
            name: newName,
          };
        }
        return item;
      });

      // Update the folders data with the renamed item
      setFolders(updatedFolders);
    }
  });
};

  return (
    <View style={{ flex: 1 }}>
      <Text
        onPress={() => navigation.navigate('Folders')}
        style={{
          flexDirection: 'row',
          width: '30%',
          height: 50,
          textAlign: 'center',
          paddingBottom: 10,
        }}>
        <Image
          source={require('../images/undo.png')} />
        <Text style={{color:'black',fontWeight:'bold'}}>Go Folders</Text>
      </Text>
      <View style={{ width: '100%', flexDirection: 'row', marginBottom: 20, marginRight: 20, marginLeft: 20 }}>
        {currentPath === RNFS.DocumentDirectoryPath ? null : (
          <Text
            style={{ fontWeight: '700' }}
            onPress={() => {
              setCurrentPath(RNFS.DocumentDirectoryPath);
              getAllFolders(RNFS.DocumentDirectoryPath);
            }}>
            Back
          </Text>
        )}

        <Text style={{ marginLeft: 20,color:'black',fontStyle:'italic' }}>{currentPath}</Text>
      </View>
      <View>
        <FlatList
          style={{ marginBottom: 100 }}
          data={folders}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 100,
              }}
              onPress={() => {
                if (!isFolder(item.name)) {
                  setCurrentPath(item.path);
                  getAllFolders(item.path);
                }
              }}
              onLongPress={() => {
                Alert.alert(
                  'Delete File/Folder',
                  'Are you sure deleted.',
                  [
                    { text: 'OK', onPress: () => deleteDir(item.path) },
                    { text: 'Cancel', onPress: () => console.log('cancel pressed..'), style: 'cancel' }
                  ]
                );


              }}>
              {isFolder(item.name) ? (
                <Image source={require('../images/icon-file.png')} style={{ width: 50, height: 50 }} />
              ) : (
                <Image
                  source={require('../images/folder.png')}
                  style={{ width: 50, height: 50 }}
                />
              )}
              <Text>{item.name.length > 20 ? `${item.name.substring(0, 10)}...` : item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.path}
        />
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 50,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModalVisible(true);
        }}>
        <ImageBackground
          style={{
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../images/open-folder.png')}>
          <Text style={{ fontSize: 40 }}>+</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 130,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModalVisible2(true);
        }}>
        <ImageBackground
          style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
          source={require('../images/file.png')}
        >
          <Text style={{ fontSize: 40 }}>+</Text>
        </ImageBackground>
      </TouchableOpacity>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 15,
              }}>
              Add New Folder
            </Text>
            <TextInput
              placeholder="Enter Folder Name"
              value={folderName}
              onChangeText={(txt) => setFolderName(txt)}
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 20,
                paddingLeft: 20,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 25,
                alignSelf: 'center',
                width: '90%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setModalVisible(false);
                createFolder();
                setFolderName('');
              }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 15,
              }}>
              Add New File
            </Text>
            <TextInput
              placeholder="Enter File Name"
              value={fileName}
              onChangeText={(txt) => setFileName(txt)}
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 20,
                paddingLeft: 20,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 25,
                alignSelf: 'center',
                width: '90%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setModalVisible2(false);
                createFile();
                setFileName('');
              }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>Create File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Main;

 

 