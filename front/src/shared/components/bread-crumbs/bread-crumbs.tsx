import { type FC } from "react";
import styles from "./bread-crumbs.module.scss";
import { Link } from "react-router-dom";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

/*export const enum BreadcrumbSimpeType {
    About='About',
    ThingsList='ThingsList',
    DialogssList='DialogsList',
} 
  
export type BreadcrumbContent ={
    name: string;
    path: string;
}

export type Breadcrumb = BreadcrumbSimpeType | BreadcrumbContent;

export type BreadcrumbSimple = BreadcrumbContent &  {
    id: BreadcrumbSimpeType;
} 

export const BreadcrumbsData:BreadcrumbSimple[] =[
    {
        id:BreadcrumbSimpeType.About,
        name:'О проекте',
        path:appRoutesURL.home
    },
    {
        id:BreadcrumbSimpeType.ThingsList,
        name:'Список вещей',
        path: appRoutesURL.things
    },
    {
        id:BreadcrumbSimpeType.DialogssList,
        name:'Список диалогов',
        path: appRoutesURL.messages
    },
];*/
 
export type BreadcrumbsProps = {
    backLink: string;
    header:string;
}

export const Breadcrumbs:FC<BreadcrumbsProps>=({backLink, header})=>{
    return <nav className={styles.nav}>
        <Link to={backLink}><ChevronLeftIcon className={styles.icon}/></Link>
        <h1>{header}</h1>
    </nav>

}
