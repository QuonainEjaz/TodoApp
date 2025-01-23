import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function TodoItem({
  // The todo object that we are currently rendering.
  todo,
  // A function that is called when the user presses the "EDIT" button.
  // It is given the id of the todo that the user is pressing the button for.
  onEdit,
  // A function that is called when the user presses the "DELETE" button.
  // It is given the id of the todo that the user is pressing the button for.
  onDelete,
}) {
  return (
    <View style={styles.todoContainer}>
      {/* The left side of the todo item. */}
      <View>
        {/* The title of the todo. */}
        <Text style={styles.todoTitle}>{todo.title}</Text>
        {/* The description of the todo. */}
        <Text style={styles.desc}>{todo.desc}</Text>
      </View>
      {/* The right side of the todo item. */}
      <View style={styles.buttonsContainer}>
        {/* The "DELETE" button. */}
        <Button
          title="DELETE"
          color="#8E24AA"
          onPress={() => onDelete(todo.id)}
        />
        {/* The "EDIT" button. */}
        <Button
          title="EDIT"
          color="#388E3C"
          onPress={() => onEdit(todo.id, todo)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'green',
  },
  todoTitle: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 340,
    marginTop: -10,
    marginBottom: 15,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 240,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 115,
  },
  desc: {
    fontSize: 12,
    color: '#999',
    width: 590,
    maxHeight: 50,
  },
});
