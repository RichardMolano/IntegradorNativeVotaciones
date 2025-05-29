import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { FAB } from "react-native-paper";
import { Dimensions } from "react-native";
import { SeguridadContext } from "../../asyncData/Context";

type FabMenuNavigatorProps = {
  visible?: boolean;
};

export default function FabMenuNavigator({
  visible = true,
}: FabMenuNavigatorProps) {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [showMenu, setShowMenu] = React.useState(false);
  const { sesion, isAuthenticated, cerrarSesion } =
    React.useContext(SeguridadContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const toggleMenu = () => {
    const toValue = showMenu ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setShowMenu(!showMenu);
  };

  const getFabStyle = (offset: number) => ({
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -offset],
        }),
      },
    ],
    opacity: animation,
  });

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={toggleMenu}>
      <View style={[styles.fabContainer, { bottom: 16 + insets.bottom }]}>
        {/* User */}

        <>
          <Animated.View style={[styles.secondaryFab, getFabStyle(120)]}>
            <FAB
              icon="vote"
              label="Votación"
              small
              onPress={() => navigation.navigate("Votación" as never)}
            />
          </Animated.View>
          <Animated.View style={[styles.secondaryFab, getFabStyle(180)]}>
            <FAB
              icon="account-tie"
              label="Candidatos"
              small
              onPress={() => navigation.navigate("Candidatos" as never)}
            />
          </Animated.View>
        </>

        {/* Admin */}
        {sesion.roleUser.name === "Admin" && (
          <>
            <Animated.View style={[styles.secondaryFab, getFabStyle(120)]}>
              <FAB
                icon="cog"
                label="Administración"
                small
                onPress={() => navigation.navigate("Administración" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(180)]}>
              <FAB
                icon="shield-account"
                label="Panel Admin"
                small
                onPress={() => navigation.navigate("Panel Admin" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(240)]}>
              <FAB
                icon="vote"
                label="Votación"
                small
                onPress={() => navigation.navigate("Votación" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(300)]}>
              <FAB
                icon="account-tie"
                label="Candidatos"
                small
                onPress={() => navigation.navigate("Candidatos" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(360)]}>
              <FAB
                icon="format-list-bulleted"
                label="Lista Elecciones"
                small
                onPress={() => navigation.navigate("ElectionsList" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(420)]}>
              <FAB
                icon="ballot"
                label="Panel Elecciones"
                small
                onPress={() => navigation.navigate("Panel Elecciones" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(480)]}>
              <FAB
                icon="plus"
                label="Crear Elección"
                small
                onPress={() => navigation.navigate("Panel Elecciones" as never)}
              />
            </Animated.View>
          </>
        )}

        {/* Administrador */}
        {sesion.roleUser.name === "Administrator" && (
          <>
            <Animated.View style={[styles.secondaryFab, getFabStyle(120)]}>
              <FAB
                icon="cog"
                label="Administración"
                small
                onPress={() => navigation.navigate("Administración" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(180)]}>
              <FAB
                icon="vote"
                label="Votación"
                small
                onPress={() => navigation.navigate("Votación" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(240)]}>
              <FAB
                icon="account-tie"
                label="Candidatos"
                small
                onPress={() => navigation.navigate("Candidatos" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(300)]}>
              <FAB
                icon="format-list-bulleted"
                label="Lista Elecciones"
                small
                onPress={() => navigation.navigate("ElectionsList" as never)}
              />
            </Animated.View>
            <Animated.View style={[styles.secondaryFab, getFabStyle(360)]}>
              <FAB
                icon="ballot"
                label="Panel Elecciones"
                small
                onPress={() => navigation.navigate("Panel Elecciones" as never)}
              />
            </Animated.View>
          </>
        )}

        {/* Botón cerrar sesión */}
        <Animated.View style={[styles.secondaryFab, getFabStyle(540)]}>
          <FAB
            icon="logout"
            label="Cerrar sesión"
            small
            style={{ backgroundColor: "#ff5252" }}
            onPress={cerrarSesion}
          />
        </Animated.View>

        <FAB
          icon={showMenu ? "close" : "menu"}
          style={styles.fab}
          onPress={toggleMenu}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const FAB_WIDTH = SCREEN_WIDTH * 0.3;

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 16,
    alignItems: "flex-start",
  },
  fab: {
    backgroundColor: "#6200ee",
  },
  secondaryFab: {
    position: "absolute",
    width: FAB_WIDTH,
    right: 0,
  },
});
