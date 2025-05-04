import { Modal, Portal, Button } from 'react-native-paper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { colors } from '../../constants/colors';

export function BottomSheetDropdown({
  visible,
  onDismiss,
  onSelect,
  listValue,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (value: boolean) => void;
  listValue: string[];
}) {
  return (
    <Portal>
      {/* dar titel  */}
      
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={{ backgroundColor: 'white', padding: 20 }}>
        <Text style={{ fontSize: 18,
        textAlign: 'center'
          , fontWeight: 'bold' }}>Selecciona una opción</Text>
      </View>
      <View style={{ height: 5, 
        width: '70%'
        , alignSelf: 'center'
        , borderRadius: 5, marginBottom: 10, marginTop: 10, borderWidth: 1, borderColor: colors.adons
        , backgroundColor: colors.adons }} />
        <TouchableOpacity
        onPress={() => { onSelect(false); onDismiss(); }} style={styles.option}>
          <Text style={styles.optionText}>{listValue[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { onSelect(true); onDismiss(); }} style={styles.option}>
          <Text style={styles.optionText}>{listValue[1]}</Text>
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
