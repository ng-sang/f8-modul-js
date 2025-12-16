const BASE_URl= "https://youtube-music.f8team.dev/api"

// const respon =await fetch(`${BASE_URl}/albums/details/soft-acoustic-morning`); /quick-picks /lines/party-hits/albums
async function mods() {
    const respon =await fetch(`${BASE_URl}/playlists/details/party-hits`);
    const data = await respon.json()
    console.log(data);
    
}
 mods()