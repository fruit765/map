function getCityShops(cityObject, shops){
    var cityShops = [];

    shops.forEach(function(shop){
        if (shop.slug === cityObject.Slug) {
            cityShops.push(shop);
        }
    });

    return cityShops;
}

function getCityObject(city, cities){
    cities.forEach(function(cityObject){
        if (city === cityObject.Name) {
            city = cityObject;
            return false;
        }
    });

    return city;
}