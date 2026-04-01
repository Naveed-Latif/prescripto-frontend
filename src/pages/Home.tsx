import Banner from "../components/Dashboard/Banner"
import Header from "../components/Dashboard/Header"
import SpecialityMenu from "../components/Dashboard/SpecialityMenu"
import TopDoctors from "../components/Dashboard/TopDoctors"
function Home() {
  return (
    <div>
      <Header />
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home
