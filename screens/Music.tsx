import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image,Alert,TouchableHighlight } from 'react-native';
import RNFS from 'react-native-fs';


interface MusicItem {
  id: string;
  name: string;
}

function Music() {
  const [MusicFiles, setMusicFiles] = useState<MusicItem[]>([]);

  useEffect(() => {
    getMusicFiles();
  }, []);
 

  const getMusicFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const MusicFiles = files
        .filter((file) => file.name.endsWith('.mp3'))
        .map((file, index) => ({ id: index.toString(), name: file.name }));
      setMusicFiles(MusicFiles);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };


  const handleDelete = async (fileName: string) => {
    try {
      await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${fileName}`);
      getMusicFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const confirmDelete = (fileName: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDelete(fileName) },
      ]
    );
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text
        style={{
          width: '100%',
          backgroundColor: '#FFFAF0',
          textAlign: 'center',
          fontSize: 25,
          fontWeight: 'bold',
          color: 'orange',
        }}
      >
        Music
      </Text>
      <FlatList
        style={{
          paddingStart: 40,
        }}
        data={MusicFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{ flexDirection: 'row' ,width:"100%"}}
            onLongPress={()=>confirmDelete(item.name)}
            >
        
            <Image source={require('../images/musical-note.png')} style={{height:26, marginTop: 15, marginEnd: 4,width:26 }}/>
            <Text style={{ fontStyle: 'italic', fontSize: 20, paddingTop: 10 }}>{item.name}</Text>
            
             
          </Text>
        )}
      />
    </View>
  );
}

export default Music;
