import styled from "styled-components";
import {useEffect, useState} from "react";
import SearchResult from "./components/SearchResult/SearchResult";

export const BASE_URL = "http://localhost:9000"


const App = () => {
const [data, setData]= useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filteredData, setFiltereddata] = useState(null);
const [selectedBtn, setSelectedBtn] = useState("all");


useEffect(() => {
  const fetchFoodData = async()  => {
    setLoading(true);
    
    try{
      const response = await fetch(BASE_URL);
  
    const json = await response.json(); 
    
    setData(json);
    setFiltereddata(json);
    setLoading(false);
    }catch (error){
      setError("Unable to fetch data");
    }
  };
fetchFoodData();
}, []);

console.log(data);


 
const searchFood = (e) =>{
  const searchValue = e.target.value;
  console.log(searchValue);
  if (searchValue == ""){
    setFiltereddata(null);
  }
  const filter = data?.filter((food) => food.name.toLowerCase().includes(searchValue.toLowerCase()));
setFiltereddata(filter);
};

const filteredFood = (type) => {
  if(type == "all"){
    setFiltereddata(data);
    setSelectedBtn("all");
    return;
  }
  const filter = data?.filter((food) => food.type.toLowerCase().includes(type.toLowerCase()));
  setFiltereddata(filter);
  setFiltereddata(filter);
  setSelectedBtn(type);
};

if (error) return <div>{error}</div>;
if (loading) return <div>loading.....</div>




  return (
<>
<Container>
    <TopContainer>
      <div className= "logo">
        <img src= "/Foody Zone.svg" alt="logo" />
      </div>

      <div className= "Search">
        <input onChange= {searchFood}
        placeholder="Search Food">

        </input>
      </div>
    </TopContainer>
    <FilterContainer>
      <Button onClick={()=>filteredFood("all")}
      >All</Button>
      <Button onClick={()=>filteredFood("breakfast")}>Breakfast</Button>
      <Button onClick={()=>filteredFood("lunch")}>Lunch</Button>
      <Button onClick={()=>filteredFood("dinner")}>Dinner</Button>
    </FilterContainer>
    

   
  </Container>
  <SearchResult data={filteredData}/>
</>
  );
};

export default App;

const Container = styled.div`
max-width: 1200px;
margin: 0 auto;
`;
const TopContainer = styled.section`
height: 140px;
display: flex;
justify-content: space-between; 
padding: 16px;
align-items: center;

.Search{
  input{
    background-color: transparent;
    border: 1px solid red;
    color: white;
    border-radius: 5px;
    height: 40px;
    font-size: 16px;
    padding: 0 10px;
  }
}

@media (0< width < 600px){
  flex-direction: column;
  height: 120px;
}

`;

const FilterContainer = styled.section`
display: flex;
justify-content: center;
gap: 12px;
padding-bottom: 40px;

`;


export const Button = styled.button`
background:rgb(180, 27, 27);
border-radius: 5px;
padding: 6px 12px;
border: none;
color: white;
cursor: pointer;
&:hover{
  background-color:rgb(117, 38, 38);
}
`;


