import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private clipboard: Clipboard) {}

  clickboard:string="copiar en portapales"

  copyHeroName() {
    this.clipboard.copy(this.data);
  }

  ngOnInit(): void {}
}

