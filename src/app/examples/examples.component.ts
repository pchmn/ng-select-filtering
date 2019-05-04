import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  items = [
    { code: '35000', label: 'Rennes' },
    { code: '75000', label: 'Paris' },
    { code: '13000', label: 'Marseille' },
    { code: '69000', label: 'Lyon' },
    { code: '59000', label: 'Lille' },
    { code: '33000', label: 'Bordeaux' },
    { code: '06000', label: 'Nice ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd' },
    { code: '35000', label: 'Rennes' },
    { code: '75000', label: 'Paris' },
    { code: '13000', label: 'Marseille' },
    { code: '69000', label: 'Lyon' },
    { code: '59000', label: 'Lille' },
    { code: '33000', label: 'Bordeaux' },
    { code: '06000', label: 'Nice ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd' },
    { code: '35000', label: 'Rennes' },
    { code: '75000', label: 'Paris' },
    { code: '13000', label: 'Marseille' },
    { code: '69000', label: 'Lyon' },
    { code: '59000', label: 'Lille' },
    { code: '33000', label: 'Bordeaux' },
    { code: '06000', label: 'Nice ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd' }
  ];
  itemSelected = 1;

  constructor() { }

  ngOnInit() {
  }

}
