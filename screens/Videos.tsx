import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image,Alert } from 'react-native';
import RNFS from 'react-native-fs';


interface VideoItem {
  id: string;
  name: string;
}

function Videos() {
  const [videoFiles, setVideoFiles] = useState<VideoItem[]>([]);
 

  useEffect(() => {
    getVideoFiles();
  }, []);
 

  const getVideoFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const videoFiles = files
        .filter((file) => file.name.endsWith('.mp4'))
        .map((file, index) => ({ id: index.toString(), name: file.name }));
      setVideoFiles(videoFiles);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  
  const handleDelete = async (fileName: string) => {
    try {
      await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${fileName}`);
      getVideoFiles();
      
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
        Videos
      </Text>
      <FlatList
        style={{
          paddingStart: 40,
        }}
        data={videoFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
          onLongPress={() => confirmDelete(item.name)}
          style={{ flexDirection: 'row' , width:"100%"}}>
        
            <Image source={require('../images/play.png')} style={{height:26, marginTop: 15, marginEnd: 4,width:26 }}/>
            <Text style={{ fontStyle: 'italic', fontSize: 20, paddingTop: 10 }}>{item.name}</Text>

             
          </Text>
        )}
      />
    </View>
  );
}

export default Videos;
