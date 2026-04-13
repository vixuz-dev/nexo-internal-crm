import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiChevronDown, FiChevronUp, FiLogOut, FiMenu, FiUser, FiBarChart2, FiUsers, FiUpload, FiFileText, FiMapPin, FiPackage, FiBookOpen, FiBriefcase } from 'react-icons/fi';
import { ROUTES } from '../utils/routes';
import nexoLogo from '../assets/images/logos/nexo-main-logo.png';
import nexoWhiteLogo from '../assets/images/logos/nexo-white-logo.webp';
import nexoIsotipo from '../assets/images/logos/nexo-isotipo.png';

// Configuración del menú organizada por categorías
const menuItems = [
  // Navegación principal
  {
    label: 'Inicio',
    icon: FiHome,
    path: ROUTES.HOMEADMINPANEL,
  },
  // Gestión de Clientes
  {
    label: 'Clientes',
    icon: FiUsers,
    children: [
      { label: 'Listado de clientes', path: ROUTES.CLIENTS_LIST },
    ],
    separatorAfter: true,
  },
  // Gestión de Afiliados
  {
    label: 'Afiliados',
    icon: FiUser,
    path: ROUTES.AFFILIATES,
    separatorAfter: true,
  },
  // Operaciones de Pedidos
  {
    label: 'Pedidos',
    icon: FiPackage,
    children: [
      { label: 'Listado de pedidos', path: ROUTES.ORDERS_LIST },
    ],
    separatorAfter: true,
  },
  // Consultas y Reportes
  {
    label: 'Consultas',
    icon: FiBookOpen,
    children: [
      // { label: 'Auditoria', path: ROUTES.CONSULTAS_AUDIT },
      // { label: 'Fichas', path: ROUTES.CONSULTAS_FICHAS },
      { label: 'Facturas', path: ROUTES.CONSULTAS_FACTURAS },
      { label: 'Resumen financiero', path: ROUTES.CONSULTAS_RESUMEN_FINANCIERO },
      // { label: 'Cobranza', path: ROUTES.CONSULTAS_COBRANZA },
      // { label: 'Cobranza diaria', path: ROUTES.CONSULTAS_COBRANZA_DIA },
    ],
  },
  // Dashboards y Análisis
  // {
  //   label: 'Dashboards',
  //   icon: FiBarChart2,
  //   children: [
  //     { label: 'Cobranza Zona', path: ROUTES.DASHBOARDS_COBRANZA_ZONA },
  //   ],
  // },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openClientes, setOpenClientes] = useState(false);
  const [openPedidos, setOpenPedidos] = useState(false);
  const [openConsultas, setOpenConsultas] = useState(false);
  const [openCobranza, setOpenCobranza] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);

  // Abrir automáticamente los grupos cuando estamos en sus rutas
  React.useEffect(() => {
    if (location.pathname.startsWith('/administrador/clientes')) {
      setOpenClientes(true);
    }
    if (location.pathname.startsWith('/afiliados/pedidos') || location.pathname.startsWith('/administrador/rutas')) {
      setOpenPedidos(true);
    }
    if (
      location.pathname.startsWith('/administrador/consultas') ||
      location.pathname === ROUTES.CONSULTAS_RESUMEN_FINANCIERO
    ) {
      setOpenConsultas(true);
    }
    if (location.pathname.startsWith('/administrador/cobranza')) {
      setOpenCobranza(true);
    }
    if (location.pathname.startsWith('/administrador/dashboards')) {
      setOpenDashboards(true);
    }
  }, [location.pathname]);

  // Responsive: colapsar en lg, ocultar en sm
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setCollapsed(true); // lg breakpoint
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center justify-center pt-6 pb-8 ${collapsed ? 'px-0' : 'px-6'}`}>
        {collapsed ? (
          <img
            src={nexoIsotipo}
            alt="Nexo"
            className="h-9"
          />
        ) : (
          <img
            src={nexoLogo}
            alt="Nexo"
            className="h-12"
          />
        )}
      </div>
      {/* Separador */}
      <div className="border-b border-neutral-200 mx-4 mb-6" />
      {/* Menu */}
      <nav className="flex-1 mt-10">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, idx) => {
            const getOpenState = () => {
              if (item.label === 'Clientes') return openClientes;
              if (item.label === 'Pedidos') return openPedidos;
              if (item.label === 'Consultas') return openConsultas;
              if (item.label === 'Empresas') return openCobranza;
              if (item.label === 'Dashboards') return openDashboards;
              return false;
            };
            const toggleOpen = () => {
              if (item.label === 'Clientes') setOpenClientes((o) => !o);
              else if (item.label === 'Pedidos') setOpenPedidos((o) => !o);
              else if (item.label === 'Consultas') setOpenConsultas((o) => !o);
              else if (item.label === 'Empresas') setOpenCobranza((o) => !o);
              else if (item.label === 'Dashboards') setOpenDashboards((o) => !o);
            };
            const isOpen = getOpenState();
            
            return (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    className={`flex items-center gap-3 w-full rounded-md px-3 py-2 text-black hover:text-primary-600 hover:bg-primary-50 transition ${collapsed ? 'justify-center px-0' : ''}`}
                    onClick={toggleOpen}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="text-xl" />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && (
                      isOpen ? <FiChevronUp className="ml-auto" /> : <FiChevronDown className="ml-auto" />
                    )}
                  </button>
                  {/* Submenu */}
                  {isOpen && !collapsed && (
                    <ul className="ml-8 mt-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `block py-1 px-2 rounded ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'}`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 transition ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'} ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="text-xl" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )}
              {/* Separador después del ítem si está configurado */}
              {item.separatorAfter && (
                <div className="my-3 mx-2 border-b border-neutral-200" />
              )}
              {/* Separador después del último ítem */}
              {idx === menuItems.length - 1 && !item.separatorAfter && (
                <div className="my-4 border-b border-neutral-200" />
              )}
            </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  // Cerrar sesión sidebar (icono + texto solo si no está colapsado)
  const logoutSidebar = (
    <NavLink
      to={ROUTES.LOGOUT}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 mb-4 mx-2 transition ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'} ${collapsed ? 'justify-center px-0' : ''}`
      }
      title="Cerrar sesión"
    >
      <FiLogOut className="text-xl" />
      {!collapsed && <span>Cerrar sesión</span>}
    </NavLink>
  );

  // Cerrar sesión drawer móvil (icono + texto)
  const logoutDrawer = (
    <NavLink
      to={ROUTES.LOGOUT}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 mb-4 mx-2 transition ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'}`
      }
    >
      <FiLogOut className="text-xl" />
      <span>Cerrar sesión</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex bg-neutral-200">
      {/* Sidebar Desktop/Tablet */}
      <aside
        className={`
          hidden sm:flex flex-col justify-between
          bg-white border-r border-neutral-200
          transition-all duration-200
          ${collapsed ? 'w-16' : 'w-64'}
          h-screen fixed left-0 top-0 z-30
        `}
      >
        <div className="flex flex-col h-full flex-1">
          {sidebarContent}
        </div>
        <div className="mt-auto pb-4">
          {logoutSidebar}
        </div>
      </aside>

      {/* Topbar para móvil */}
      <header className="sm:hidden w-full flex items-center justify-between bg-white px-4 py-3 border-b border-neutral-200 fixed top-0 left-0 z-40">
        <img src={nexoLogo} alt="Nexo" className="h-9" />
        <button onClick={() => setMobileMenu((open) => !open)} className="text-primary-600 focus:outline-none">
          <FiMenu size={28} />
        </button>
      </header>
      {/* Drawer móvil */}
      {mobileMenu && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-40" onClick={() => setMobileMenu(false)}>
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col">
            <div className="flex items-center mb-6">
              <img src={nexoLogo} alt="Nexo" className="h-7" />
            </div>
            <nav className="flex-1">
              <ul className="space-y-1 mt-24">
                {menuItems.map((item) => {
                  const getMobileOpenState = () => {
                    if (item.label === 'Clientes') return openClientes;
                    if (item.label === 'Pedidos') return openPedidos;
                    if (item.label === 'Consultas') return openConsultas;
                    if (item.label === 'Empresas') return openCobranza;
                    if (item.label === 'Dashboards') return openDashboards;
                    return false;
                  };
                  const toggleMobileOpen = (e) => {
                    e.stopPropagation();
                    if (item.label === 'Clientes') setOpenClientes((o) => !o);
                    else if (item.label === 'Pedidos') setOpenPedidos((o) => !o);
                    else if (item.label === 'Consultas') setOpenConsultas((o) => !o);
                    else if (item.label === 'Empresas') setOpenCobranza((o) => !o);
                    else if (item.label === 'Dashboards') setOpenDashboards((o) => !o);
                  };
                  const isMobileOpen = getMobileOpenState();
                  
                  return (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-black hover:text-primary-600 hover:bg-primary-50 transition"
                          onClick={toggleMobileOpen}
                        >
                          <item.icon className="text-xl" />
                          <span>{item.label}</span>
                          {isMobileOpen ? <FiChevronUp className="ml-auto" /> : <FiChevronDown className="ml-auto" />}
                        </button>
                        {isMobileOpen && (
                          <ul className="ml-8 mt-1">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <NavLink
                                  to={child.path}
                                  className={({ isActive }) =>
                                    `block py-1 px-2 rounded ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'}`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-md px-3 py-2 transition ${isActive ? 'text-primary-600 bg-primary-100 font-bold' : 'text-black hover:text-primary-600 hover:bg-primary-50'}`
                        }
                      >
                        <item.icon className="text-xl" />
                        <span>{item.label}</span>
                      </NavLink>
                    )}
                    {/* Separador después del ítem si está configurado */}
                    {item.separatorAfter && (
                      <div className="my-3 mx-2 border-b border-neutral-200" />
                    )}
                  </li>
                  );
                })}
              </ul>
              <div className="my-4 border-b border-neutral-200" />
            </nav>
            <div className="mt-auto pb-4">
              {logoutDrawer}
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className={`flex-1 min-h-screen pt-0 sm:pt-0 ${collapsed ? 'sm:ml-16' : 'sm:ml-64'}`}>
        {/* Espacio para el topbar en móvil */}
        <div className="sm:hidden h-14" />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 