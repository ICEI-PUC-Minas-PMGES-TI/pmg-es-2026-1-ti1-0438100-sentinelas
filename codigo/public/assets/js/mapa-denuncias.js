async function carregarHeatmap() {       
  try {                                  
    const response = await fetch(       
      "http://localhost:3000/heatmap"
    );
    
    const data = await response.json(); 

    const locais = data.complaints.map(coord => ({  
      lat: parseFloat(coord[0]),         
      lng: parseFloat(coord[1])          
    }));

    console.log(locais);                 
    return locais;                       

  } catch (error) {                      
    console.error("Erro:", error);       
  }
}