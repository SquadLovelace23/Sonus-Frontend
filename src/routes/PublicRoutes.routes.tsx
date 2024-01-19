import { Routes, Route } from "react-router-dom"
import { FC, Suspense, lazy } from "react"
import PrivateRoutes from "./PrivateRoutes.routes"
import Search from "../pages/Search/Search"
import Library from "../pages/Library/Library"
import Album from "../pages/Album/Album"
import Artist from "../pages/Artist/Artist"
import Genres from "../pages/Genres/Genres"
import Playlist from "../pages/Playlist/Playlist"
import Profile from "../pages/Profile/Profile"
import HomepageLoader from "../components/Loaders/HomepageLoader"
import Favourites from "../pages/Favourites/Favourites"

const RoutesComponent: FC = () => {

  const Home = lazy(() => import("../pages/Home/Home"))

  return (
    <Routes>
      <Route path='/' element={<Suspense fallback={<HomepageLoader />}><Home /> </Suspense>} />
      <Route path='/*' element={
        <PrivateRoutes>
          <Routes>
            <Route path='/library/:id' element={<Library />} />
            <Route path='/profile/:name' element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path='/genre/:id' element={<Genres />} />
            <Route path='/artist/:id' element={<Artist />} />
            <Route path='/playlist/:id' element={<Playlist />} />
            <Route path='/album/:id' element={<Album />} />
            <Route path='/favourites/:id' element={<Favourites />} />
          </Routes>
        </PrivateRoutes>
      } />
    </Routes>
  )
}

export default RoutesComponent