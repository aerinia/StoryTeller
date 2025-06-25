import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../constants/firebaseConfig.js';

export default function HomeScreen({ navigation }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stories"));
        const loadedStories = [];
        querySnapshot.forEach(doc => {
          loadedStories.push({ id: doc.id, ...doc.data() });
        });
        setStories(loadedStories);
      } catch (error) {
        console.error("Hikaye çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Hikayeler</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Story", { story: item })}
          >
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15 },
  storyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  loadingContainer: { flex:1, justifyContent: 'center', alignItems: 'center' }
});
