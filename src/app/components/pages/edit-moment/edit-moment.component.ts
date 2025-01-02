import { Component, OnInit } from '@angular/core';
import { Moment } from '../../../interfaces/Moment';
import { MomentService } from '../../../services/moment/moment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MomentFormComponent } from '../../moment-form/moment-form.component';
import { MessagesService } from '../../../services/messages/messages.service';

@Component({
  selector: 'app-edit-moment',
  standalone: true,
  imports: [NgIf, MomentFormComponent],
  templateUrl: './edit-moment.component.html',
  styleUrl: './edit-moment.component.css'
})
export class EditMomentComponent implements OnInit {
  moment!: Moment;
  btnText: string = "Editar";

  constructor(
    private momentService: MomentService, 
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get("id"));

      this.momentService.getMoment(id).subscribe(item => {
        this.moment = item.data;
      })
  }

  async editHandler(momentData: Moment) {
    const id = this.moment.id;
    const formData = new FormData();

    formData.append('title', momentData.title);
    formData.append('description', momentData.description);

    if(momentData.image) {
      formData.append('image', momentData.image);
    }

    await this.momentService.updateMoment(id!, formData).subscribe(() => {
      this.messagesService.add(`Momento ${id} foi atualizado com sucesso!`);
      this.router.navigate(['/']);
    });
  }
}
