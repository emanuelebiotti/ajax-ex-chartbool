$(document).ready(function(){



$.ajax({
  url:'http://157.230.17.132:4003/sales',
  method: 'GET',
  success: function(vendite){
    console.log(vendite);
    data = ['0', '0', '0', '0','0', '0', '0', '0','0', '0', '0', '0'] //qui vanno i dati di vendita di ogni mese

    for (var i = 0; i<vendite.length; i++) {
      var datavendita = moment(vendite[i].date).format('YYYY-MM-DD');
      var mercevenduta = vendite[i].amount;
      var mesevendita = moment(datavendita).month();

    }


    var ctx = $('#myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
            datasets: [{
                label: 'Vendite totali',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

  },
  error: function(){
    alert('error');
  }
});




});
