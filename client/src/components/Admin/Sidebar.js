import React from 'react'
import { Link } from 'react-router-dom';
import { Add, Dashboard, ExpandMore, ImportExport, ListAlt, People, PostAdd, QrCode, Room } from '@mui/icons-material';
import {TreeItem, TreeView} from '@mui/lab' 
import './Sidebar.css'

function Sidebar({open, active}) {

  return (
    <div className="sidebar">
        <Link to="/">
            <img src="https://play-lh.googleusercontent.com/-LLFboO3-LMZDXn9_2DyCtssJPXqxlbBciKoJ25o5S5wulGJo1QXme4HlFbevrYxUg" alt='logo' />
        </Link>
        <Link to="/admin/dashboard" className={active==="dashboard" ? "active":""}>
            <p>
                <Dashboard /> Dashboard
            </p>
        </Link>
        <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<Room />}
            defaultExpanded={open==="hotels" ? ['1'] : []}
        >
            <TreeItem nodeId='1' label="Hotels">
                <Link to="/admin/hotels" className={active==="hotels" ? "active":""}>
                    <TreeItem nodeId='2' label='All' icon={<PostAdd />}  />
                </Link>
                <Link to="/admin/hotel/new" className={active==="newHotel" ? "active":""}>
                    <TreeItem nodeId='3' label='Create' icon={<Add />}  className={active==="create" ? "active" : ""}/>
                </Link>
            </TreeItem>
        </TreeView>
        <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ImportExport />}
            defaultExpanded={open==="rooms" ? ['1'] : []}
        >
            <TreeItem nodeId='1' label="Rooms">
                <Link to="/admin/rooms" className={active==="rooms" ? "active" : ""}>
                    <TreeItem nodeId='2' label='All' icon={<PostAdd />}  />
                </Link>
                <Link to="/admin/room/new" className={active==="newRoom" ? "active" : "" }>
                    <TreeItem nodeId='3' label='Create' icon={<Add />}  className={active==="create" ? "active" : ""}/>
                </Link>
            </TreeItem>
        </TreeView>
        <Link to="/admin/orders" className={active==="order" ? "active":""}>
            <p>
                <ListAlt /> Orders
            </p>
        </Link>
        <Link to="/admin/users" className={active==="user" ? "active":""}>
            <p>
                <People /> Users
            </p>
        </Link>
        <Link to="/admin/scanner" className={active==="scanner" ? "active":""}>
            <p>
                <QrCode /> Scanner
            </p>
        </Link>
    </div>
  )
}

export default Sidebar