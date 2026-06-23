const initialFarms = [
  {
    id: 1,
    farmName: "Green Valley Farm",
    farmSize: "12.5",
    soilType: "Alluvial Soil",
    state: "Punjab",
    district: "Ludhiana",
    village: "Samrala",
    pinCode: "141114",
    plots: [
      {
        id: 1,
        plotName: "North Field",
        plotSize: "7.5",
        cropType: "Wheat",
      },
      {
        id: 2,
        plotName: "South Field",
        plotSize: "5.0",
        cropType: "Rice",
      },
    ],
    totalPlots: 2,
    totalPlotSize: 12.5,
  },
  {
    id: 2,
    farmName: "Sunshine Agriculture",
    farmSize: "8.0",
    soilType: "Black Cotton Soil",
    state: "Maharashtra",
    district: "Nagpur",
    village: "Wardha",
    pinCode: "442001",
    plots: [
      {
        id: 1,
        plotName: "Main Plot",
        plotSize: "8.0",
        cropType: "Cotton",
      },
    ],
    totalPlots: 1,
    totalPlotSize: 8.0,
  },
  {
    id: 3,
    farmName: "Heritage Organic Farm",
    farmSize: "15.0",
    soilType: "Red Soil",
    state: "Karnataka",
    district: "Bangalore",
    village: "Devanahalli Village Name",
    pinCode: "562110",
    plots: [
      {
        id: 1,
        plotName: "Organic Plot A",
        plotSize: "6.0",
        cropType: "Tomato",
      },
      {
        id: 2,
        plotName: "Organic Plot B",
        plotSize: "4.5",
        cropType: "Onion",
      },
      {
        id: 3,
        plotName: "Fruit Section",
        plotSize: "4.5",
        cropType: "Mango",
      },
    ],
    totalPlots: 3,
    totalPlotSize: 15.0,
  },
];

export {initialFarms};