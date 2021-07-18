import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
//import * as Chart from 'chart.js';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {

  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  doughnutChart: any;
  myChart: Chart
  myChart2: Chart
  positivo: number = 0
  dataConfig: {} = {
    proprietario: String,
    valorGasto: Number,
    band: String,
    taxaIluminacao: Number,
    taxaMoratorios: Number,
    dataProxLeitura: String,
    numeroDias: String,
  }
  constructor() {

  }
  ngAfterViewInit() {
    Chart.register(...registerables);

    
    this.loadDataConfig()
    this.doughnutChartMethod(98);

    //this.contador()

  }

  public doughnutChartMethod(valor) {
    this.positivo = valor
    const ctx: any = document.getElementById('myChart');
    const ctx2: any = document.getElementById('myChart2');

    this.myChart = new Chart(ctx, {

      type: 'doughnut',
      data: {
        labels: ['Gastos', 'Meta'],
        datasets: [{
          //label: '# of Votes',
          data: [this.positivo, 100 - this.positivo],

          backgroundColor: [
            'rgba(255, 99, 132, 1)',

            'rgba(75, 192, 192, 1)',

          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',

            'rgba(75, 192, 192, 1)',

          ],
          borderWidth: 1
        }]
      },
      options: {
        cutout: "98%" // Config responsável pelo espessura do gráfico!
      }
    });

    this.myChart2 = new Chart(ctx2, {

      type: 'doughnut',
      data: {
        labels: ['Gastos', 'Meta'],
        datasets: [{
          //label: '# of Votes',
          data: [this.positivo, 100 - this.positivo],

          backgroundColor: [
            'rgba(255, 99, 132, 1)',

            'rgba(75, 192, 192, 1)',

          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',

            'rgba(75, 192, 192, 1)',

          ],
          borderWidth: 1
        }]
      },
      options: {
        cutout: "98%" // Config responsável pelo espessura do gráfico!
      }
    });
  }

  loadDataConfig() {
    this.dataConfig = {
      proprietario: 'Inácio Mota',
      valorGasto: 56.6,
      band: 'Vermelha (R$ 09.50)',
      taxaIluminacao: 11.00,
      taxaMoratorios: 0,
      dataProxLeitura: '23/07/2021',
      numeroDias: '30',
    }
  }

  //ainda n utilizados
  contador() {
    var a = this.positivo

    setInterval(function () {
      if (a == 10) {
        console.log(a)
        a = 0
      } else {
        console.log(a)
        a = a + 1
      }

    }, 300);


  }


}
