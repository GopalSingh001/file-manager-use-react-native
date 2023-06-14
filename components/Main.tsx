import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import ModalData from './Modal';

interface Folder {
  name: string;
  path: string;
}
interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

const Main = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [currentPath, setCurrentPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameItemPath, setRenameItemPath] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Folder | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);



  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Storage permissions granted');
        getAllFiles();
        // getAllFolders(currentPath)
      } else {
        console.log('Storage permissions denied');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // get all files from external storage ..
  const getAllFiles = async () => {
    try {
      const externalStoragePath = RNFS.ExternalStorageDirectoryPath;
      const result: ReadDirItem[] = await RNFS.readDir(externalStoragePath);
      const fileItems: FileItem[] = result.map((item) => ({
        name: item.name,
        path: item.path,
        isDirectory: item.isDirectory(),
      }));
      setFiles(fileItems);
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
      await RNFS.writeFile(`${currentPath}/${fileName}`, 'utf8');
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



  const openRenameModal = (path: string) => {
    setRenameItemPath(path);
    setNewItemName('');
    setRenameModalVisible(true);
  };

  const renameItem = async () => {
    try {
      if (newItemName === '') {
        Alert.alert("warning", 'Please Enter Your new Name..')
      }
      else {
        await RNFS.moveFile(renameItemPath, `${currentPath}/${newItemName}`);
        setRenameModalVisible(false);
        getAllFolders(currentPath);


      }

    } catch (error) {
      console.log(error);
    }
  };


  const showOptions = (item: Folder) => {
    setSelectedItem(item);
    setOptionsVisible(true);
  };

  const closeOptions = () => {
    setOptionsVisible(false);
  };

  const handleDelete = () => {
    closeOptions();
    deleteDir(selectedItem!.path);
  };

  const handleRename = () => {
    closeOptions();
    openRenameModal(selectedItem!.path);
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
        <Text style={{ color: 'black', fontWeight: 'bold' }}>Go Folders</Text>
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

        <Text style={{ marginLeft: 20, color: 'black', fontStyle: 'italic' }}>{currentPath}</Text>
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
                showOptions(item)
              }}>

              {isFolder(item.name) ? (
                item.name.endsWith('.jpg') ?
                  <Image source={require('../images/jpg-file.png')} style={{ width: 50, height: 50 }} />
                  : item.name.endsWith('.pdf') ?
                    <Image source={require('../images/pdf.png')} style={{ width: 50, height: 50 }} />
                    : item.name.endsWith('.jpeg') ?
                      <Image source={require('../images/jpeg.png')} style={{ width: 50, height: 50 }} />
                      : item.name.endsWith('.png') ?
                        <Image source={require('../images/png.png')} style={{ width: 50, height: 50 }} />
                        : item.name.endsWith('.mp3') ?
                          <Image source={require('../images/musical-note.png')} style={{ width: 50, height: 50 }} />
                          : item.name.endsWith('.mp4') ?
                            <Image source={require('../images/play.png')} style={{ width: 50, height: 50 }} />
                            : <Image source={require('../images/icon-file.png')} style={{ width: 50, height: 50 }} />
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
      <ModalData renameModalVisible={renameModalVisible}
        setNewItemName={setNewItemName}
        setRenameModalVisible={setRenameModalVisible}
        folderName={folderName}
        setFolderName={setFolderName}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        createFolder={createFolder}
        setModalVisible2={setModalVisible2}
        modalVisible2={modalVisible2}
        fileName={fileName}
        createFile={createFile}
        setFileName={setFileName}
        newItemName={newItemName}
        renameItem={renameItem}
        optionsVisible={optionsVisible}
        handleDelete={handleDelete}
        handleRename={handleRename}
        closeOptions={closeOptions}
        setOptionsVisible={setOptionsVisible}
        folders={folders}
        setFolders={setFolders}
      />

    </View>
  );
};

export default Main;