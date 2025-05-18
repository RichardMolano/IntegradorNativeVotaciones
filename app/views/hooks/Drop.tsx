import { Modal, Portal } from "react-native-paper";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

const highlightColor = "#c7b3f7";

export function BottomSheetDropdown({
  visible,
  onDismiss,
  onSelect,
  listValue,
}: {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (value: string) => void;
  listValue: string[];
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Selecciona una opción</Text>
        </View>
        <View style={styles.divider} />
        {listValue.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => {
              onSelect(value);
              onDismiss();
            }}
            style={styles.option}
          >
            <Text style={styles.optionText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#232323",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: highlightColor,
  },
  divider: {
    height: 5,
    width: "70%",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: highlightColor,
    backgroundColor: highlightColor,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    color: highlightColor,
  },
});
