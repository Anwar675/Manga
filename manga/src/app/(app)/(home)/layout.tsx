import { Header } from "./header";


interface Props {
    children: React.ReactNode;
}

const Layout = ({children}: Props) => {
    return (
        <div>
            <Header  />
            {children}
        </div>
    )
}
export default Layout;  