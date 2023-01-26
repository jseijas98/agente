import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '../../services/persistence/persistence.service';

@Component({
  selector: 'app-algo',
  templateUrl: './algo.component.html',
  styleUrls: ['./algo.component.css']
})
export class AlgoComponent implements OnInit {

  constructor( private persistence:PersistenceService) { }

  ngOnInit(): void {
 

    this.persistence.getPersistenceHealth().subscribe(data1 => {

      console.log(data1)
    
    })
  }
}
