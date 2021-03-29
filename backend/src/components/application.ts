import {Component, provide} from '@layr/component';

import {Movie} from './movie';

export class Application extends Component {
  @provide() static Movie = Movie;
}
