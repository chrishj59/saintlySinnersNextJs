import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import AppBreadcrumb from './AppBreadCrumb';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef((props, ref) => {
    const { onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <div className="topbar-start">
                <button ref={menubuttonRef} type="button" className="topbar-menubutton p-link p-trigger" onClick={onMenuToggle}>
                    <i className="pi pi-bars"></i>
                </button>

                <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
            </div>

            <div className="topbar-end">
                <ul className="topbar-menu">
                    <li className="topbar-search">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search"></i>
                            <InputText type="text" placeholder="Search" className="w-12rem sm:w-full" />
                        </span>
                    </li>
                    <li className="topbar-profile">
                        <button type="button" className="p-link" onClick={showProfileSidebar}>
                            <img src={`${contextPath}/layout/images/avatar.png`} alt="Profile" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default AppTopbar;
