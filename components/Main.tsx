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
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

interface Folder {
  name: string;
  path: string;
}

const Main: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<Folder[]>([]);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
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
      const result = await RNFS.readDir(path);
      console.log('GOT RESULT', result);
      setFolders(result.map((item) => ({ name: item.name, path: item.path })));
    } catch (err) {
      console.log(err);
    }
  };

  const isFolder = (name: string): boolean => {
    const itsFolder=name.includes('.')
    return  itsFolder
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
      await RNFS.writeFile(
        `${currentPath}/${fileName}.txt`,
        'hello how are you'
      );
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

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          margin: 20,
          marginTop: 10,
        }}
      >
        {currentPath === RNFS.DocumentDirectoryPath ? null : (
          <Text
            style={{ fontWeight: '700' }}
            onPress={() => {
              setCurrentPath(RNFS.DocumentDirectoryPath);
              getAllFolders(RNFS.DocumentDirectoryPath);
            }}
          >
            Back
          </Text>
        )}
        <Text style={{ marginLeft: 20 }}>{currentPath}</Text>
      </View>
      <View style={{ marginTop: 50 }}>
        <ScrollView>
          <FlatList
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
                  deleteDir(item.path);
                }}
              >
                {isFolder(item.name) ? (
                  <Image
                    source={require('../images/icon-file.png')}
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <Image
                    source={require('../images/folder.png')}
                    style={{ width: 50, height: 50 }}
                  />
                )}
                <Text>
                  {item.name.length > 20
                    ? `${item.name.substring(0, 10)}...`
                    : item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.path}
          />
        </ScrollView>
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 50,
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
         
        <ImageBackground
          style={{
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../images/open-folder.png')}
        >
           <Text style={{fontSize:13,color:'black'}}>Add</Text>
        
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
        }}
      >
        
        <ImageBackground
          style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
          source={require('../images/file.png')}
        >
           <Text style={{fontSize:13,color:'black'}}>Add</Text>
        </ImageBackground>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
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
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 15,
              }}
            >
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
              }}
            >
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
        }}
      >
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
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              height: 200,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 15,
              }}
            >
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
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Create File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Main;
