$(document).ready(function(){


$.ajax({
  url:'http://157.230.17.132:4003/sales',
  method: 'GET',
  success: function(response){

    // GRAFICO VENDITE ANNUALI

    var mesi = {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0
    }

    for (var i = 0; i < response.length; i++) {
      var vendita = response[i];
      var ammontare = vendita.amount;
      var datavendita = vendita.date;
      var moment_data = moment(datavendita, "DD/MM/YYYY");
      var mesevendita = moment_data.format('MMMM');
      mesi[mesevendita] += ammontare;
    }
    console.log(mesi);

    var label_mesi = Object.keys(mesi);
    var dati_vendite = Object.values(mesi);

    disegna_grafico_vendite_mensili(label_mesi, dati_vendite)


    // GRAFICO VENDITE PER VENDITORE


    var vendite = {};
    var totalevendite = 0;
    // ciclo i risultati e preparo un oggetto con chiavi = venditore e
    // valore = totale venduto
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
      totalevendite += importo;
    }

    //preparo le percentuali di vendita per ogni venditore
    if (totalevendite > 0) {
      for (venditore in vendite){
        var totale_vendite_venditore = vendite[venditore];
        var percentuale_vendite_venditore = (totale_vendite_venditore * 100)/totalevendite;
        vendite[venditore] = percentuale_vendite_venditore.toFixed(1);
      }
    } else {
      log('dati non disponibili');
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
      'type': 'doughnut',
      'data': {
        'datasets': [{
          'data': dati,
          'backgroundColor': ['#82D8D0', 'lightblue', '#FDC36F', 'lightgreen']
          }],
       'labels': nomi
      },
      'options': {
        'title': {
            'display': true,
            'text': 'Fatturato per venditore - 2017'
        }
    }
  });
}

function disegna_grafico_vendite_mensili(mesi, dati) {

  var myLineChart = new Chart($('#grafico_vendite_mensili'), {
    'type': 'line',
    'data': {
      'datasets': [{
        'data': dati,
        'backgroundColor': ['#82D8D0', 'lightblue', '#FDC36F', 'lightgreen']
        }],
    'labels': mesi
    },
  });
}

});
