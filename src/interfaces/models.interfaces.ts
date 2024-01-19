export interface User {
  id: any
  name?: String
  email?: String
  password?: String
  avatar: String
  song?: String[]
  likedSong?: String[]
  likedAlbums?: String[]
  playlist?: String[]
  likedPlaylist?: String[]
  followedUserId?: string
  followedById?: String[]
}

export interface Song {
  id: string
  name: String
  url: string
  cover: string
  isLiked: Boolean
  duration?: String
  Artist: Array<Artist>
  Album: Array<Album>
  likedSong?: String[]
  Song: Array<Song>
  listened?: number | undefined
  genreId?: String[]
  artistId?: String[]
  albumId?: String[]
}

export interface Artist {
  id: String
  name: String
  img: string
  songId?: String[]
  albumId?: String[]
  genreId?: String[]
}

export interface Album {
  id: String
  name: String
  cover: string
  liked: Boolean
  artist: String[]
  Artist: Array<Artist>
  Album: Array<Album>
  likedAlbums?: String[]
  songId?: String[]
  artistId?: String[]
  genreId?: String[]
}

export interface Playlist {
  id: string
  name: string
  cover: string
  liked: Boolean
  User: User
  Playlist: Array<Playlist>
  numSong?: Number
  songId?: String[]
  userId?: string
  likedPlaylist?: String[]
}

export interface Genre {
  id: String
  name: String
  songId?: String[]
  artistId?: String[]
  albumId?: String[]
}

