import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

interface ModalDataProps {
  renameItem: () => void;
  newItemName: string;
  renameModalVisible: boolean;
  setNewItemName: (text: string) => void;
  setRenameModalVisible: (visible: boolean) => void;
  folderName: string;
  setFolderName: (text: string) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  createFolder: () => void;
  setModalVisible2: (visible: boolean) => void;
  modalVisible2: boolean;
  fileName: string;
  setFileName: (text: string) => void;
  createFile: () => void;
  optionsVisible: boolean;
  closeOptions: () => void;
  handleDelete: () => void;
  handleRename: () => void;
  setOptionsVisible: (visible :boolean) => void;
  folders: any[];
  setFolders: (folders: any[]) => void;

}

const ModalData: React.FC<ModalDataProps> = ({
  renameItem,
  newItemName,
  renameModalVisible,
  setNewItemName,
  setRenameModalVisible,
  folderName,
  setFolderName,
  modalVisible,
  setModalVisible,
  createFolder,
  setModalVisible2,
  modalVisible2,
  fileName,
  setFileName,
  createFile,
  optionsVisible,
  closeOptions,
  handleDelete,
  handleRename,
  setOptionsVisible,
  folders,
  setFolders
  
}) => {
  return (
    <View>
      {/* Rename Modal */}
      <Modal animationType="slide" transparent={true} visible={renameModalVisible}>
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFE0',
            width: '90%',
            height: 200,
            borderRadius: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 15
            }}
            >
              Rename Item
            </Text>
            <TextInput
              style={{
                width: '90%',
                height: 50,
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 20,
                paddingLeft: 20,
                borderRadius: 10,
                borderBottomColor: 'grey',
                borderBottomWidth: 4

              }}
              placeholder="Enter new name"
              value={newItemName}
              onChangeText={(text) => setNewItemName(text)}
            />
            <View style={{ flexDirection: 'row', gap: 20, justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  marginTop: 25,
                  alignSelf: 'center',
                  width: '25%',
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: '#FFA07A',
                  justifyContent: 'center',
                  alignItems: 'center',

                }}
                onPress={renameItem}>
                <Text style={{ color: 'white', fontSize: 18 }}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 25,
                  alignSelf: 'center',
                  width: '25%',
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: '#C0C0C0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setRenameModalVisible(false)}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* folder creation Model */}
      <Modal
        animationType='slide'
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
              backgroundColor: 'rgb(176,224,230)',
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
                borderBottomColor: 'grey',
                borderBottomWidth: 4
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
                if (folderName === '') {
                  Alert.alert('Instructions', 'Please Enter Folder Name..')
                }
                else {
                  setModalVisible(false);
                  createFolder();
                  setFolderName('');
                }

              }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* file creation Model */}
      <Modal
       
        animationType='slide'
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
              backgroundColor: 'rgb(255,182,193)',
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
                borderBottomColor: 'grey',
                borderBottomWidth: 4
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
                if (fileName == '') {
                  Alert.alert('Warning', 'Please Enter File Name..  Like a (music.mp3,  video.mp4,  image.jpf,  doc.pdf etc.)')
                }
                else {
                  createFile();
                  setModalVisible2(false);
                  setFileName('');
                }

              }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>Create File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* show Options  */}
      <Modal
      animationType='slide'
        visible={optionsVisible}
        transparent
        onRequestClose={closeOptions}
      >
        <View style={styles.modalContainer}>
        <TouchableOpacity
      style={styles.optionButton}
      onPress={() => {
        Alert.alert(
          'Delete File/Folder',
          'Are you sure you want to delete this file/folder?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress:()=>setOptionsVisible(false)
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: handleDelete,
            },
          ]
        );
      }}
    >
      <Text style={styles.optionText}>Delete</Text>
    </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleRename}>
            <Text style={styles.optionText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={closeOptions}>
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent:'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionButton: {
    width:"100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
     marginBottom:1,
    backgroundColor: 'black',
     
  },
  optionText: {fontSize:20,
    color:'white',
    fontStyle:'italic'}
});
export default ModalData;
