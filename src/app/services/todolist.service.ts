import { Task } from './../interfaces/task.interface';
import { TaskModel } from './../models/task.model';
import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from '../../assets/config';
declare let window: any;
@Injectable({
  providedIn: 'root',
})
export class TodolistService {
  public web3: any;
  public todoList: any;
  public loading:boolean;
  public task:TaskModel;
  public narray:Task[];
  constructor() {
    this.conect();
    this.task = new TaskModel(this.narray);
  }
  conect() {
    if (window.ethereum === undefined) {
      window.alert('No tienes instalado Metamask');
    } else {
      this.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7645');
      this.todoList = new this.web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
      this.loading=false;
    }
  }
  async getAccount(): Promise<any> {
    return await this.web3.eth.getAccounts();
  }
  async getTasks(){
    const array=[];
    const taskC = await this.todoList.methods.taskCount().call();
    for (let i = 1; i <= taskC; i++) {
      const task = await this.todoList.methods.tasks(i).call();
      var taskObj:Task = {
        content: task.content,
        completed:task.completed,
        id:task.id
      }
      array.push(taskObj);
    }
    this.task.array= array;
    return true;
  }
  async createTask(content:string,account:any){
    return await this.todoList.methods.createTask(content)
      .send({ from: account })
      .on("receipt", () => {});
  }
  async actualizarTarea(taskId:any,account:any){
    return await this.todoList.methods
    .toggleCompleted(taskId)
    .send({ from: account })
    .on("receipt", () => {});
  }
}
