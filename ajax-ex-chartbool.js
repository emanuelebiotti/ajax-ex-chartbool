$(document).ready(function(){

  disegna_grafici();

  // vado a intercettare il click sul pulsante inserisci per inserire
  // i dati selezionati nelle select e immessi nell'input

  $('#inserisci').click(function(){
    //vado a leggere le selezioni dell'utente
    var mesevendita = $('#mese_vendita').val();
    var venditore = $('#nomi_venditori').val();
    var nuovavendita = parseInt($('#nuovavendita').val());
    $('#mese_vendita').children().first().attr('selected', 'selected');
    $('#nomi_venditori').children().first().attr('selected', 'selected');
    $('#nuovavendita').val('')

    // controllo cosa ha inserito l'utente
    var validatore = valida_dati_vendita(mesevendita, venditore, nuovavendita);
    if (validatore) {
      //preparo una data con un formato corretto
      var data_vendita = moment('01-' + mesevendita + '-2017', 'DD-MMMM-YYYY');
      data_vendita = data_vendita.format('DD/MM/YYYY');
      console.log(data_vendita);

      // se tutti i dati sono validi li invio con una POST
      $.ajax({
        url:'http://157.230.17.132:4003/sales',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
         "salesman": venditore,
         "amount": nuovavendita,
         "date": data_vendita
       }),
        success: function(response){
          disegna_grafici();
        },
        error: function(){
          alert('error');
        }
      });

    } else {
      alert('compila tutti i dati')
    }
  });


// $.ajax({
//   url:'http://157.230.17.132:4003/sales',
//   method: 'GET',
//   success: function(response){
//     // console.log(response);
//     popola_select(response);
//     organizza_dati_vendite_annuali(response);
//     organizza_dati_vendite_venditore(response);
//   },
//   error: function(){
//     alert('error');
//   }
// });

function disegna_grafici(){
  $.ajax({
    url:'http://157.230.17.132:4003/sales',
    method: 'GET',
    success: function(response){
      // console.log(response);
      popola_select(response);
      organizza_dati_vendite_annuali(response);
      organizza_dati_vendite_venditore(response);
    },
    error: function(){
      alert('error');
    }
  });
}

function valida_dati_vendita(mese, nome, somma) {
  if (mese.length == 0 || nome.length == 0 || isNaN(somma) || somma <= 0 || somma.length == 0){
    return false;
  }
  return true;
}

function popola_select(dati_grezzi){
  var nomi_venditori = [];
  //ciclo tutti i risultati e cerco i nomi dei venditori
    $('#nomi_venditori').append('<option value ="">seleziona un venditore</option>');
  for (var i = 0; i < dati_grezzi.length; i++){
    var nome_venditore = dati_grezzi[i].salesman;
    if (!nomi_venditori.includes(nome_venditore)){
      nomi_venditori.push(nome_venditore);
      $('#nomi_venditori').append('<option value= "'+ nome_venditore + '">' + nome_venditore + '</option>');
    }
  }

  var mesi = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

  $('#mese_vendita').append('<option>seleziona un mese</option>');
  for (var j = 0; j < mesi.length; j++) {
    $('#mese_vendita').append('<option value= "'+ mesi[j] + '">' + mesi[j] + '</option>');
  };
 }

function organizza_dati_vendite_venditore(dati_grezzi) {

  // GRAFICO VENDITE PER VENDITORE

  var vendite = {};
  var totalevendite = 0;
  // ciclo i risultati e preparo un oggetto con chiavi = venditore e
  // valore = totale venduto
  for (var i = 0; i < dati_grezzi.length; i++){
    var vendita = dati_grezzi[i];
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

}

function organizza_dati_vendite_annuali(dati_grezzi) {

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

  for (var i = 0; i < dati_grezzi.length; i++) {
    var vendita = dati_grezzi[i];
    var ammontare = parseInt(vendita.amount);
    var datavendita = vendita.date;
    var moment_data = moment(datavendita, "DD/MM/YYYY");
    var mesevendita = moment_data.format('MMMM');
    mesi[mesevendita] += ammontare;
  }

  var label_mesi = Object.keys(mesi);
  var dati_vendite = Object.values(mesi);


  disegna_grafico_vendite_mensili(label_mesi, dati_vendite)
}


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
    'options': {
      'title': {
          'display': true,
          'text': 'Fatturato per mese - 2017'
      }
  }
  });
}

});
