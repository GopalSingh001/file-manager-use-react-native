import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import RNFS from 'react-native-fs';

interface ImagesItem {
  id: string;
  name: string;
}

function Images() {
  const [ImageFiles, setImageFiles] = useState<ImagesItem[]>([]);

  useEffect(() => {
    getImagesFiles();
  }, []);

  const getImagesFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const ImageFiles = files
        .filter((file) =>
          file.name.endsWith('.jpg') ||
          file.name.endsWith('.png') ||
          file.name.endsWith('.jpeg') ||
          file.name.endsWith('.pdf')
        )
        .map((file, index) => ({ id: index.toString(), name: file.name }));
      setImageFiles(ImageFiles);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${fileName}`);
      getImagesFiles();
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
        Images
      </Text>
      <FlatList
        style={{
          paddingStart: 40,
        }}
        data={ImageFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{ flexDirection: 'row', width: '100%' }}
            onLongPress={() => confirmDelete(item.name)}
          >
            {item.name.endsWith('.pdf') ? (
              <Image
                source={require('../images/pdf.png')}
                style={{ height: 26, marginTop: 15, marginEnd: 4, width: 26 }}
              />
            ) : item.name.endsWith('.jpg') ? (
              <Image
                source={require('../images/jpg-file.png')}
                style={{ height: 26, marginTop: 15, marginEnd: 4, width: 26 }}
              />
            ) : item.name.endsWith('.png') ? (
              <Image
                source={require('../images/png.png')}
                style={{ height: 26, marginTop: 15, marginEnd: 4, width: 26 }}
              />
            ) : item.name.endsWith('.jpeg') ? (
              <Image
                source={require('../images/jpeg.png')}
                style={{ height: 26, marginTop: 15, marginEnd: 4, width: 26 }}
              />
            ) : null}
            <Text style={{ fontStyle: 'italic', fontSize: 20, paddingTop: 10 }}>{item.name}</Text>
          </Text>
        )}
      />
    </View>
  );
}

export default Images;
