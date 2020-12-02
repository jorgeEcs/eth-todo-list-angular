import { TaskModel } from './../../models/task.model';
import { Task } from './../../interfaces/task.interface';
import { TodolistService } from './../../services/todolist.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styles: [
  ]
})
export class TodolistComponent implements OnInit {
  public tasks:TaskModel;
  public loading:boolean;
  public account:any;
  public taskForm = this.fb.group({
    content:["",[Validators.required]],
  });
  constructor(private todolistService:TodolistService,private fb:FormBuilder) {
    this.loading = todolistService.loading;
    this.tasks= todolistService.task;
   }

  ngOnInit(): void {
    this.todolistService.getAccount().then(resp=>{
      this.account= resp[0];
      console.log(this.account);
      
    });
    this.todolistService.getTasks().then(resp=>{
      console.log(resp,this.tasks);

      
    });
  }
  agregarTarea(){
    this.loading=true;
    const content = this.taskForm.get('content').value;
    this.todolistService.createTask(content,this.account).then(
      resp=>{
        this.todolistService.getTasks();
        this.loading=false;
        this.taskForm.setValue({content:''});
      }
    )
    .catch(
      error=>{
        this.loading=false;
        console.log("Error",error);
        this.todolistService.getTasks();
    });
  }
  actulizar(id:number){
    console.log(id,this.account);
    this.loading=true;
    this.todolistService.actualizarTarea(id,this.account).then(
      resp=>{
        this.todolistService.getTasks();
        this.loading=false;
      }
    )
    .catch(
      error=>{
        console.log("Error",error);
        this.todolistService.getTasks();
    });
  }
}
