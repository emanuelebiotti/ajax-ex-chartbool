$(document).ready(function(){


$.ajax({
  url:'http://157.230.17.132:4003/sales',
  method: 'GET',
  success: function(response){
    // console.log(response);

    var vendite = {};
    for (var i = 0; i < response.length; i++){
      var vendita = response[i];
      var venditore = vendita.salesman;
      var importo = vendita.amount;

      var venditori_inseriti = Object.keys(vendite);
      if (!venditori_inseriti.includes(venditore)) {
        vendite[venditore] = importo;
      } else {
        vendite[venditore] += importo;
      }
    }

    var label_venditori = Object.keys(vendite);
    var dati_vendite_per_venditore = Object.values(vendite)

    disegna_grafico_vendite_venditore(label_venditori, dati_vendite_per_venditore);

  },
  error: function(){
    alert('error');
  }
});


function disegna_grafico_vendite_venditore(nomi, dati) {

  var myPieChart = new Chart($('#grafico_venditori'), {
      type: 'pie',
      data: {
        datasets: [{
          data: dati,
          }],
       labels: nomi
      },
  });

}

});
