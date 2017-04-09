import { Injectable } from "@angular/core";
import { Word } from "../../../../both/models/word.model";
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Mongo} from "meteor/mongo";


@Injectable()
export class WordDataService {
  private wordsURL: string = "http://localhost:8000/api/words";


  constructor(private http: Http) {}

  public readAll(startingWith?: string): Observable<Word[]> {
    let searchParams = new URLSearchParams();

    if(startingWith) {
      searchParams.append("startsWith", startingWith);
    }
    
    let options = new RequestOptions({
          search: searchParams
      });
    
    return this.http.get(this.wordsURL, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  public read(id: number): Observable<Word> {
    let url = this.wordsURL + "/" + id;
    
    return this.http.get(url)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  public create(spelling: string, languageId: Mongo.ObjectID): Observable<Word> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.wordsURL, { name }, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}