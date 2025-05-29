import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Animated, Platform, Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { SeguridadContext } from "../../asyncData/Context";

type NavBarProps = {
  visible?: boolean;
};

const DRAWER_WIDTH = 320;
const ARROW_BUTTON_HEIGHT = 48; // Altura aproximada del botón

export default function NavBar({ visible = true }: NavBarProps) {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [showMenu, setShowMenu] = React.useState(Platform.OS === "web");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { sesion, isAuthenticated, cerrarSesion } =
    React.useContext(SeguridadContext);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMenu]);

  if (Platform.OS !== "web" || !visible) return null;

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Secciones del menú según el rol del usuario
  // Suponiendo que tienes acceso a sesion y isAuthenticated en este componente
  // Si no, pásalos como props o usa contexto

  // Ejemplo de obtención de rol y autenticación (ajusta según tu app)
  // const { sesion, isAuthenticated } = useAuthContext();

  let sections: {
    title: string;
    items: { icon: string; label: string; nav: string }[];
  }[] = [];

  const role = sesion?.roleUser?.name;
  const isAuth = isAuthenticated && sesion?.id;

  sections = [
    {
      title: "Usuarios",
      items: [
        { icon: "vote", label: "Votación", nav: "Votación" },
        { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
      ],
    },
  ];
  if (role === "Admin") {
    sections = [
      {
        title: "Administración",
        items: [
          { icon: "cog", label: "Administración", nav: "Administración" },
          { icon: "shield-account", label: "Panel Admin", nav: "Panel Admin" },
        ],
      },
      {
        title: "Elecciones",
        items: [
          { icon: "plus", label: "Crear Elección", nav: "Panel Elecciones" },
          {
            icon: "format-list-bulleted",
            label: "Lista Elecciones",
            nav: "ElectionsList",
          },
        ],
      },
      {
        title: "Usuarios",
        items: [
          { icon: "vote", label: "Votación", nav: "Votación" },
          { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
        ],
      },
    ];
  } else if (role === "Administrator") {
    sections = [
      {
        title: "Administración",
        items: [
          { icon: "cog", label: "Administración", nav: "Administración" },
        ],
      },
      {
        title: "Elecciones",
        items: [
          { icon: "plus", label: "Crear Elección", nav: "Panel Elecciones" },
          {
            icon: "format-list-bulleted",
            label: "Lista Elecciones",
            nav: "ElectionsList",
          },
        ],
      },
      {
        title: "Usuarios",
        items: [
          { icon: "vote", label: "Votación", nav: "Votación" },
          { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
        ],
      },
    ];
  }

  if (role === "User" && !isAuth) {
    sections = [
      {
        title: "Usuarios",
        items: [
          { icon: "vote", label: "Votación", nav: "Votación" },
          { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
        ],
      },
    ];
  } else if (role === "Admin") {
    sections = [
      {
        title: "Administración",
        items: [
          { icon: "cog", label: "Administración", nav: "Administración" },
          { icon: "shield-account", label: "Panel Admin", nav: "Panel Admin" },
        ],
      },
      {
        title: "Elecciones",
        items: [
          { icon: "plus", label: "Crear Elección", nav: "Panel Elecciones" },
          {
            icon: "format-list-bulleted",
            label: "Lista Elecciones",
            nav: "ElectionsList",
          },
        ],
      },
      {
        title: "Usuarios",
        items: [
          { icon: "vote", label: "Votación", nav: "Votación" },
          { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
        ],
      },
    ];
  } else if (role === "Administrador") {
    sections = [
      {
        title: "Administración",
        items: [
          { icon: "cog", label: "Administración", nav: "Administración" },
        ],
      },
      {
        title: "Elecciones",
        items: [
          { icon: "plus", label: "Crear Elección", nav: "ElectionCreate" },
          {
            icon: "format-list-bulleted",
            label: "Lista Elecciones",
            nav: "ElectionsList",
          },
          {
            icon: "format-list-bulleted",
            label: "Procesos",
            nav: "ElectionsProcess",
          },
        ],
      },
      {
        title: "Usuarios",
        items: [
          { icon: "vote", label: "Votación", nav: "Votación" },
          { icon: "account-tie", label: "Candidatos", nav: "Candidatos" },
        ],
      },
    ];
  }

  return (
    <>
      {/* Flecha animada */}
      <Pressable
        style={[
          styles.arrowButton,
          {
            top: insets.top + 8,
            backgroundColor: showMenu ? "#b380f4" : "transparent",
          },
        ]}
        onPress={() => setShowMenu((prev) => !prev)}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon source="chevron-left" size={32} color="#fff" />
        </Animated.View>
      </Pressable>
      {showMenu == false ? (
        <View
          style={[
            styles.sidebar,
            {
              paddingTop: insets.top + ARROW_BUTTON_HEIGHT + 16,
              paddingBottom: insets.bottom,
              marginTop: 8,
            },
          ]}
        >
          <View style={styles.drawerContent}>
            {sections.map((section) => (
              <View key={section.title} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon source="dots-horizontal" size={18} color="#bdb6d6" />
                  <View style={styles.sectionTitleWrapper}>
                    <span style={styles.sectionTitle as any}>
                      {section.title}
                    </span>
                  </View>
                </View>
                <View style={styles.sectionButtons}>
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      className="drawer-fab"
                      style={styles.drawerFab as any}
                      onClick={() => navigation.navigate(item.nav as never)}
                    >
                      <View style={styles.fabContent}>
                        <Icon source={item.icon} size={22} color="#fff" />
                        <span style={styles.fabLabel as any}>{item.label}</span>
                      </View>
                    </button>
                  ))}
                </View>
              </View>
            ))}
            {/* Botón cerrar sesión */}
            <button
              className="drawer-fab"
              style={{
                ...styles.drawerFab,
                backgroundColor: "#ff5252",
                color: "#fff",
                marginTop: 32,
                fontWeight: "bold",
              }}
              onClick={cerrarSesion}
            >
              <View style={styles.fabContent}>
                <Icon source="logout" size={22} color="#fff" />
                <span style={styles.fabLabel as any}>Cerrar sesión</span>
              </View>
            </button>
          </View>
        </View>
      ) : null}
      {/* CSS para hover */}
      <style>
        {`
                    .drawer-fab:hover {
                        background: #b380f4 !important;
                    }
                `}
      </style>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    width: DRAWER_WIDTH,
    height: "100vh",
    backgroundColor: "#1c1b1f",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    zIndex: 1000,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "column",
  } as any,
  drawerContent: {
    flex: 1,
    gap: 24,
    paddingVertical: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitleWrapper: {
    flex: 1,
    marginLeft: 4,
  },
  sectionTitle: {
    color: "#bb86db",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "inherit",
  },
  sectionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fabLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "inherit",
    letterSpacing: 0.2,
  },
  drawerFab: {
    backgroundColor: "transparent",
    borderRadius: 8,
    transition: "background 0.2s",
    cursor: "pointer",
    outlineWidth: 0,
    borderWidth: 0,
    boxShadow: "none",
    marginVertical: 0,
    alignSelf: "stretch",
    minHeight: 40,
    border: "none",
    textAlign: "left",
    padding: 0,
  } as any,
  arrowButton: {
    position: "fixed",
    left: 8,
    zIndex: 1100,
    borderRadius: 16,
    padding: 4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    cursor: "pointer",
    transition: "background 0.2s",
  } as any,
});
