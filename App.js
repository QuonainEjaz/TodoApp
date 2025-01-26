import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, View, FlatList, Text, Keyboard, Alert, Image } from 'react-native';
import TodoItem from './components/TodoItem';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // A 3-second loading time
    const timer = setTimeout(() => {setIsLoading(false);  // Hide the loader after 3 seconds
    }, 3000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  
  // This state variable holds the list of todos.
  // It is initialized to an empty array.
  const [todos, setTodos] = useState([]);

  // This state variable holds the text of the title and description
  // of the new todo that the user is currently entering.
  // It is initialized to empty strings.
  const [input, setInput] = useState({ title: '', desc: '' });

  // This state variable holds a boolean value that indicates
  // whether the user is currently editing an existing todo.
  // It is initialized to false.
  const [isEditing, setIsEditing] = useState(false);

  // This state variable holds the id of the todo that the user is
  // currently editing.
  // If the user is not editing any todo, it is null.
  // It is initialized to null.
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    fetchTodos();
  }, []);
  useEffect(() => {
      saveTodosToStorage();
  },[todos])
  // This function fetches the list of todos from AsyncStorage.
  // It is called when the app starts.
  const fetchTodos = async () => {
    const storedTodos = await AsyncStorage.getItem('todos');
    setTodos(storedTodos ? JSON.parse(storedTodos) : []);    
  };
  const saveTodosToStorage = async () => {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
  };
 
  // This function changes the title of the input state variable.
  // It is called when the user changes the text in the title input field.
  const handleTitleChange = (text) => {
    setInput({ ...input, title: text });
  };

  // This function changes the description of the input state variable.
  // It is called when the user changes the text in the description input field.
  const handleDescChange = (text) => {
    setInput({ ...input, desc: text });
  };

  // This function adds a new todo to the list of todos.
  // If the user is editing an existing todo, it updates the existing todo.
  // It is called when the user presses the "ADD TODO" button.
  const handleAddTodo = () => {
    // Dismiss the keyboard.
    Keyboard.dismiss();

    // If the title is empty, display an alert and do nothing else.
    if ((input.title === undefined) || (input.title.trim() === '')) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    // If the user is editing an existing todo, update the existing todo.
    if (isEditing) {
      // If the description is empty, set it to 'None'.
      if ((input.desc === undefined) || (input.desc.trim() === '')) {
        input.desc = 'None';
      };
      // Update the existing todo in the list of todos.
      setTodos(
        (itTakesAllTodosAssArray) =>
          itTakesAllTodosAssArray.map((mappingEachTodo) =>
            mappingEachTodo.id === editingId
              ? { ...mappingEachTodo, title: input.title, desc: input.desc }
              : mappingEachTodo
          )
      );
      // Set isEditing to false to indicate that the user is not editing any todo.
      setIsEditing(false);
      // Set editingId to null to indicate that the user is not editing any todo.
      setEditingId(null);
    } else {
      // Add a new todo to the list of todos.
      setTodos([...todos, { id: Date.now().toString(), title: input.title, desc: input.desc }]);
    }
    // If the description is empty, set it to 'None'.
    if ((input.desc === undefined) || (input.desc.trim() === '')) {
      input.desc = 'None';
      setTodos([...todos, { id: Date.now().toString(), title: input.title, desc: input.desc }]);
    };
    // Reset the input state variable to empty strings.
    setInput({ title: '', desc: '' });
  };

  // This function edits an existing todo.
  // It is called when the user presses the "EDIT" button.
  const handleEditTodo = (id, todo) => {
    // Dismiss the keyboard.
    Keyboard.dismiss();

    // If the description of the todo is 'None', set the description of the input state variable to an empty string.
    if (todo.desc === 'None') {
      setInput({ title: todo.title });
      setIsEditing(true);
      setEditingId(id);
      return true;
    };

    // Set the title and description of the input state variable to the title and description of the todo.
    setInput({ title: todo.title, desc: todo.desc });
    setIsEditing(true);
    setEditingId(id);
  };

  // This function deletes an existing todo.
  // It is called when the user presses the "DELETE" button.
  const handleDeleteTodo = (id) => {
    // Dismiss the keyboard.
    Keyboard.dismiss();

    // Remove the todo from the list of todos.
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    // Set isEditing to false to indicate that the user is not editing any todo.
    setIsEditing(false);
  
  };
  if (isLoading) {
    return (
      <View style={styles.loadercontainer}>
        <Image 
          source={require('./assets/pics/loader.png')} 
          style={styles.loaderImage}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputTitle}
          placeholder="Title:"
          maxLength={30}
          value={input.title}
          onChangeText={handleTitleChange}
        />
        <TextInput
          style={styles.inputDesc}
          placeholder="Description (optional):"
          multiline={true}
          
          value={input.desc}
          onChangeText={handleDescChange}
        />
      </View>
      <Button
        title={isEditing ? 'UPDATE' : 'ADD TODO'}
        onPress={handleAddTodo}
        color="#1976D2"
      />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightyellow',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    
  },
  inputContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  inputTitle: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 5,
    backgroundColor: '#FFFAF0',
    width: 380,
    height: 50,
  },
  inputDesc: {
    verticalAlign: 'top',
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#FFFAF0',
    width: 380,
    height: 100,
    marginBottom: 5,
  },
  loadercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderImage: {
    width: '61%',
    height: '30%',
  },

});
