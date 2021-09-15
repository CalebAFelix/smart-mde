import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import * as Chart from 'chart.js';
import { Chart, ChartDataset, ChartType, registerables } from 'chart.js';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  doughnutChart: any;
  myChart: Chart


  validations_form: FormGroup;

  positivo: number = 0
  dataConfig = {
    bandeira: 0,
    outros: 0,
    tarifa: 0,
    data: '',
    iluminacao: 0,

  }
  backupData = {
    tarifa: 0,
    iluminacao: 0,
    bandeira: 0,
    outros: 0,
    data: new Date(),
    total: 0,

  }
  dataBase = {
    potency: 0,
    current: 0,
    date: ''
  }
  loadSubs: Subscription;

  startTime: string;
  entradaData: string;
  entradaHora: string;
  potenciaSomadaDiaria: number = 0;
  public dates: any[] = []
  public potency: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    public afDB: AngularFireDatabase,
  ) {
  }


  ngOnInit() {
    this.validator_forms()
    Chart.register(...registerables);
    // this.loadDataConfig()
    //this.contador()
  }

  ionViewDidEnter() {
    this.loadConfigs()
  }

  loadConfigs() {

    this.afDB.object('configMDE/values/Chave').snapshotChanges().subscribe(action => {
      this.dataConfig.bandeira = action.payload.exportVal().bandeira
      this.dataConfig.data = action.payload.exportVal().data
      this.dataConfig.outros = action.payload.exportVal().outros
      this.dataConfig.tarifa = action.payload.exportVal().tarifa
      this.dataConfig.iluminacao = action.payload.exportVal().iluminacao
      console.log(this.dataConfig)
    })

    this.loadSubs = this.afDB.list("2021/09/").snapshotChanges(['child_added', 'child_changed', 'child_removed']).subscribe(actions => {
      this.potenciaSomadaDiaria = 0
      let i = 0
      actions.forEach(action => {
        this.dataBase = action.payload.exportVal()
        console.log(this.dataBase)
        if (this.dataBase.current < 2) {
          this.potenciaSomadaDiaria = this.potenciaSomadaDiaria + this.dataBase.potency
        }
        this.dates[i] = this.dataBase.date
        this.potency[i] = this.dataBase.potency
        i = i + 1
      });
      //Desconsiderar acima de 1.5 amperes de corrente

      this.potenciaSomadaDiaria = (this.potenciaSomadaDiaria / (1000 * 60)) * this.dataConfig.tarifa + Number(this.dataConfig.bandeira) + Number(this.dataConfig.outros) + Number(this.dataConfig.iluminacao)
      if (this.myChart) {
        this.myChart.destroy()
      }
      this.lineChartMethod(this.dates, this.potency)

      //this.removeData(this.myChart)

    })
  }

  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }


  updateConfigs() {
    var config = {
      bandeira: this.dataConfig.bandeira,
      outros: this.dataConfig.outros,
      tarifa: this.dataConfig.tarifa,
      iluminacao: this.dataConfig.iluminacao,
      data: this.dataConfig.data,
    }

    this.afDB.list("configMDE/values/").update("Chave", config) //no cru
    this.loadConfigs()
  }

  splitDates(xeu) {
    this.dates = xeu
    //função que separa fornecedores sem repetir nomes
    this.dates = this.dates.filter(function (elem, pos, self) {
      return self.indexOf(elem) == pos
    })

    console.log(this.dates)

  }



  public lineChartMethod(x: any[], y: any[]) {
    const ctx: any = document.getElementById('myChart');

    let a: number[] = []
    let b: number[] = []

    for (let o = 0; o < 10; o = o + 1) {
      console.log(x[x.length - (o + 1)])
      a[o] = x[x.length - (o + 1)]
      b[o] = y[x.length - (o + 1)]
    }


    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: a,

        datasets: [{
          data: b,
          label: 'Gastos ao vivo',
          borderColor: "#0f5",
          backgroundColor: '#fff',
          fill: false

        }]
      },

      options: {
        plugins: {
          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: 'Gastos mensais'
          }
        },
        interaction: {
          intersect: false,
        }
      },
    });

    const inputs = {
      min: -100,
      max: 100,
      count: 8,
      decimals: 2,
      continuity: 1
    };

    const data2 = {
      labels: 'a',
      datasets: [
        {
          label: 'Dataset',
          data: 50,
          borderColor: "#000",
          backgroundColor: '#777',
          fill: false
        }
      ]
    };

    let config = {
      type: 'line',
      data: data2,
      options: {
        plugins: {
          filler: {
            propagate: false,
          },
          title: {
            display: true,
            text: (ctx) => 'Fill: ' + ctx.chart.data.datasets[0].fill
          }
        },
        interaction: {
          intersect: false,
        }
      },
    }
  }
  public doughnutChartMethod(valor) {
    this.positivo = valor
    const ctx: any = document.getElementById('myChart');

    this.myChart = new Chart(ctx, {

      type: 'line',
      data: {
        labels: [100 - this.positivo, this.positivo],
        datasets: [{
          data: [100 - this.positivo, this.positivo],


          borderWidth: 1
        }]
      },

    });


  }
  //validadores
  validator_forms() {
    this.validations_form = this.formBuilder.group({
      tarifa: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bandeira: new FormControl('', Validators.compose([
        Validators.required
      ])),
      outros: new FormControl('', Validators.compose([
        Validators.required
      ])),
      iluminacao: new FormControl('', Validators.compose([
        Validators.required
      ])),
      data: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });

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