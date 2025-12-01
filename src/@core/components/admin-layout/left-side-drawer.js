"use client";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import useSidebar from "./sidebar/useSidebar";
export default function LeftSideBar({ open }) {
  // const route = usePathname();
  // console.log('current route', route.startsWith('/admin/grocery'));
  const {
    sidebarItems,
    sidebarGrocery,
    sidebarMedicine,
    sidebarFood,
    sidebarRestaurant,
  } = useSidebar();
  const [sidebarData, setSidebarData] = React.useState([]);
  const [onClicked, setOnClicked] = React.useState("Home");
  const [activeModule, setActiveModule] = React.useState([]);
  const [activeSubModule, setActiveSubModule] = React.useState([]);
  const [activeInnerSubModule, setActiveInnerSubModule] = React.useState([]);

  useEffect(() => {
    if (onClicked === "Home") {
      setSidebarData(sidebarItems);
    } else if (onClicked === "Grocery") {
      setSidebarData(sidebarGrocery);
    } else if (onClicked === "Medicine") {
      setSidebarData(sidebarMedicine);
    } else if (onClicked === "Food") {
      setSidebarData(sidebarFood);
    } else if (onClicked === "Offering Restaurants") {
      setSidebarData(sidebarRestaurant);
    }
  }, [onClicked]);

  const handleActiveModule = (name) => {
    setOnClicked(name);
    if (activeModule.includes(name)) {
      setActiveModule([]);
    } else {
      setActiveModule([name]);
    }
    setActiveSubModule([]);
    setActiveInnerSubModule([]);
  };

  const handleActiveSubModule = (name) => {
    setOnClicked(name);
    if (activeSubModule.includes(name)) {
      setActiveSubModule([]);
    } else {
      setActiveSubModule([name]);
    }
  };

  const handleActiveInnerSubModule = (name) => {
    if (activeInnerSubModule.includes(name)) {
      setActiveInnerSubModule([]);
    } else {
      setActiveInnerSubModule([name]);
    }
  };

  return (
    <>
      <Divider />
      <List sx={{ marginTop: 2 }}>
        {sidebarData.map((listItem, i) => (
          <ListItem key={i} disablePadding sx={{ display: "block" }}>
            <Link href={listItem.link}>
              <ListItemButton
                onClick={() => handleActiveModule(listItem.module)}
                className="top-button"
                sx={{
                  background: `${
                    activeModule.includes(listItem.module) ? "#212929a6 " : ""
                  }`,
                  color: `${
                    activeModule.includes(listItem.module) ? "#fff" : "#959595"
                  }`,
                }}
              >
                <ListItemIcon
                  className="btn-icon"
                  sx={{
                    minWidth: `${open ? "30px" : "56px"}`,
                    color: `${
                      activeModule.includes(listItem.module)
                        ? "#fff"
                        : "#959595"
                    }`,
                    fontSize: "1.2em",
                  }}
                >
                  {listItem.icon}
                </ListItemIcon>
                <ListItemText primary={listItem.module} />
                {listItem.subModule.length > 0 && (
                  <>
                    {activeModule.includes(listItem.module) ? (
                      <ExpandMore />
                    ) : (
                      <ExpandLess sx={{ transform: "rotate(90deg)" }} />
                    )}
                  </>
                )}
              </ListItemButton>
            </Link>
            {listItem.subModule.length > 0 &&
              listItem.subModule.map((item, j) => (
                <Collapse
                  key={j}
                  in={activeModule.includes(listItem.module)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton
                      onClick={() => handleActiveSubModule(item.subModuleName)}
                      sx={{
                        padding: "0.2em 0em 0.2em 0.5em",
                        margin: "0.3em 0.5em 0.3em 1em",
                        borderRadius: "5px",
                        pl: 1,
                        background: `${
                          activeSubModule.includes(item.subModuleName)
                            ? "#1b2323"
                            : ""
                        }`,
                        color: `${
                          activeSubModule.includes(item.subModuleName)
                            ? "#fff"
                            : "#959595"
                        }`,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: `${open ? "30px" : "56px"}`,
                          color: `${
                            activeSubModule.includes(item.subModuleName)
                              ? "#fff"
                              : "#959595"
                          }`,
                          fontSize: ".9em",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <Link href={item.link}>
                        <ListItemText primary={item.subModuleName} />
                      </Link>
                      {item.innerSubModule.length > 0 && (
                        <>
                          {activeSubModule.includes(item.subModuleName) ? (
                            <ExpandMore />
                          ) : (
                            <ExpandLess sx={{ transform: "rotate(90deg)" }} />
                          )}
                        </>
                      )}
                    </ListItemButton>
                    {item.innerSubModule &&
                      item.innerSubModule.map((innerItem, k) => (
                        <Collapse
                          key={k}
                          in={activeSubModule.includes(item.subModuleName)}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List
                            component="div"
                            disablePadding
                            sx={{
                              color: `${
                                activeInnerSubModule.includes(
                                  innerItem.innerName
                                )
                                  ? "#fff"
                                  : "#959595"
                              }`,
                            }}
                          >
                            <ListItemButton
                              sx={{ pl: 5 }}
                              onClick={() =>
                                handleActiveInnerSubModule(innerItem.innerName)
                              }
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: `${open ? "30px" : "56px"}`,
                                  color: `${
                                    activeInnerSubModule.includes(
                                      innerItem.innerName
                                    )
                                      ? "#fff"
                                      : "#959595"
                                  }`,
                                }}
                              >
                                {innerItem.icon}
                              </ListItemIcon>
                              <ListItemText primary={innerItem.innerName} />
                            </ListItemButton>
                          </List>
                        </Collapse>
                      ))}
                  </List>
                </Collapse>
              ))}
          </ListItem>
        ))}
      </List>
    </>
  );
}
