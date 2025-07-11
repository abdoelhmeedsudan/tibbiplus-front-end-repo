import { Component } from '@angular/core';
import { SlicePipe } from '@angular/common';

import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { projects } from '../../../../shared/data/project';

@Component({
  selector: 'app-user-task',
  imports: [SlicePipe, CardComponent],
  templateUrl: './user-task.component.html',
  styleUrl: './user-task.component.scss'
})

export class UserTaskComponent {

  public projects = projects;

}
