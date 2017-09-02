import React, {Component} from 'react';
import './App.css';
import combinatorics from 'js-combinatorics'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      name: '',
      number: 5,
      first: [],
      second: [],
      third: [],
      playType: '',
      scratched: [],
      error: '',
      race: []
    };
  }

  horseRaceName(e) {
    this.setState({name: e.target.value})
  }

  number(e) {
    this.setState({
      number: parseInt(e.target.value, 10)
    })
  }

  first(e) {

    this.setState({
      first: this.legalCharacters(e.target.value)
    })
  }

  second(e) {
    this.setState({second: e.target.value})
  }

  third(e) {
    this.setState({third: e.target.value})
  }

  scratched(e) {
    this.setState({scratched: e.target.value})
  }

  renderPossibilities() {
    if (this.state.number !== '' && this.state.scratched !== '') {
      var array = []
      for (var i = 0; i < this.state.number; i++) {
        array.push(i + 1)
      }
      return array.map(function(a, i) {
        return <p key={'select' + i}>{a}</p>
      })
    }
  }
  contains(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  }

  addScratch(e) {
    var parsedE = parseInt(e.target.value, 10);
    if (this.contains(this.state.scratched, parsedE)) {
      var i = this.state.scratched.indexOf(parsedE);
      if (i > -1) {
        var array = this.state.scratched;
        array.splice(i, 1)
        this.setState({scratched: array});
      }
    } else {
      var new_scratched = this.state.scratched.concat(parsedE)
      this.setState({scratched: new_scratched})
    }
  }

  renderScratch(a, i) {
    return (
      <div key={'scratchd' + i} className="scratch-box">
        <input key={'scratch' + i} type="checkbox" name="scratch" value={a} onChange={this.addScratch.bind(this)} checked={this.contains(this.state.scratched, a)}/>
        <p className="scratch-p" key={'scratchp' + i}>{a}</p>
      </div>
    )
  }

  renderScratches() {
    if (this.state.number !== '') {
      var array = []
      for (var i = 1; i <= this.state.number; i++) {
        array.push(i)
      }
      return array.map(this.renderScratch.bind(this))
    }
  }

  //steps
  //name = 1
  //num horses = 2
  //scratches = 3
  //first = 4
  //second = 5
  //third = 6
  //fourth = 7

  moveForward(e) {
    if (this.state.step === 1 && this.state.name === '') {
      this.setState({error: 'Need race name.'})
    } else if (this.state.step === 5 && this.state.first.length === 0) {
      this.setState({error: 'Need at least one 1st place winner.'})
    } else if (this.state.step === 4 && this.state.playType === '') {
      this.setState({error: 'Need play type.'})
    } else {
      this.setState({
        step: this.state.step + 1,
        error: ''
      })
    }
  }

  combo() {

    var all_horses = []
    for (var g = 1; g <= this.state.number; g++) {
      if (!this.contains(this.state.scratched, g)) {
        all_horses.push(g)
      }
    }

    var mini;
    var combos = [];
    var cmb,
      cmba,
      all_horses_copy,
      index0,
      index1;
    for (var i = 0; i < this.state.first.length; i++) {
      if (this.state.second.length > 0) {
        for (var j = 0; j < this.state.second.length; j++) {
          if (this.state.first[i] !== this.state.second[j]) {
            if (this.state.third.length > 0) {
              for (var k = 0; k < this.state.third.length; k++) {
                if (this.state.first[i] !== this.state.second[j] && this.state.first[i] !== this.state.third[k] && this.state.second[j] !== this.state.third[k]) {
                  mini = [this.state.first[i], this.state.second[j], this.state.third[k]]
                  all_horses_copy = all_horses.slice(0)
                  index0 = all_horses_copy.indexOf(mini[0]);
                  if (index0 > -1) {
                    all_horses_copy.splice(index0, 1);
                  }
                  index1 = all_horses_copy.indexOf(mini[1]);
                  if (index1 > -1) {
                    all_horses_copy.splice(index1, 1);
                  }
                  var index2 = all_horses_copy.indexOf(mini[2]);
                  if (index2 > -1) {
                    all_horses_copy.splice(index2, 1);
                  }
                  cmb = combinatorics.combination(all_horses_copy, 1);
                  while (cmba = cmb.next()) {
                    combos.push([mini[0], mini[1], mini[2], cmba[0]]);
                  }
                }
              }
            } else {
              mini = [this.state.first[i], this.state.second[j]]
              all_horses_copy = all_horses.slice(0)
              index0 = all_horses_copy.indexOf(mini[0]);
              if (index0 > -1) {
                all_horses_copy.splice(index0, 1);
              }
              index1 = all_horses_copy.indexOf(mini[1]);
              if (index1 > -1) {
                all_horses_copy.splice(index1, 1);
              }
              if (this.state.playType === 'Superfecta') {
                cmb = combinatorics.combination(all_horses_copy, 2);
                while (cmba = cmb.next()) {
                  combos.push([mini[0], mini[1], cmba[0], cmba[1]])
                  combos.push([mini[0], mini[1], cmba[1], cmba[0]])
                }
              } else {
                cmb = combinatorics.combination(all_horses_copy, 1);
                while (cmba = cmb.next()) {
                  combos.push([mini[0], mini[1], cmba[0]])
                }
              }
            }
          }
        }
      } else {
        mini = [this.state.first[i]]
        all_horses_copy = all_horses.slice(0)
        index0 = all_horses_copy.indexOf(mini[0]);
        if (index0 > -1) {
          all_horses_copy.splice(index0, 1);
        }
        if (this.state.playType === 'Superfecta') {
          cmb = combinatorics.combination(all_horses_copy, 3);
          while (cmba = cmb.next()) {
            combos.push([mini[0], cmba[0], cmba[1], cmba[2]])
            combos.push([mini[0], cmba[0], cmba[2], cmba[1]])
            combos.push([mini[0], cmba[1], cmba[0], cmba[2]])
            combos.push([mini[0], cmba[1], cmba[2], cmba[0]])
            combos.push([mini[0], cmba[2], cmba[1], cmba[0]])
            combos.push([mini[0], cmba[2], cmba[0], cmba[1]])
          }
        } else {
          cmb = combinatorics.combination(all_horses_copy, 2);
          while (cmba = cmb.next()) {
            combos.push([mini[0], cmba[0], cmba[1]]);
            combos.push([mini[0], cmba[1], cmba[0]]);
          }
        }

      }
    }
    return combos

  }

  moveSubmit() {
    var combo = this.combo();
    var obj = {
      name: this.state.name,
      number: this.state.number,
      first: this.state.first,
      second: this.state.second,
      third: this.state.third,
      scratched: this.state.scratched,
      playType: this.state.playType,
      combo: combo
    }
    var arr = this.state.race;
    arr.unshift(obj)
    this.setState({
      submit: true,
      step: 1,
      name: '',
      first: [],
      playType: '',
      number: 5,
      second: [],
      third: [],
      error: '',
      scratched: [],
      race: arr
    })
  }

  moveBackward() {
    this.setState({
      step: this.state.step - 1
    })
  }

  renderError() {
    return <p className="error-p">{this.state.error}</p>
  }

  playType(e) {
    this.setState({playType: e.target.value})
  }

  addFirst(e) {
    var parsedE = parseInt(e.target.value, 10);
    if (this.contains(this.state.first, parsedE)) {
      var i = this.state.first.indexOf(parsedE);
      if (i > -1) {
        var array = this.state.first;
        array.splice(i, 1)
        this.setState({first: array});
      }
    } else {
      var new_first = this.state.first.concat(parsedE)
      this.setState({first: new_first})
    }
  }

  renderFirst(a, i) {
    return (
      <div key={'firsts' + i} className="scratch-box">
        <input key={'firstss' + i} type="checkbox" name="first" value={a} onChange={this.addFirst.bind(this)} checked={this.contains(this.state.first, a)}/>
        <p className="scratch-p" key={'firstsss' + i}>{a}</p>
      </div>
    )
  }

  renderFirstSelects() {
    var arr = [];
    for (var i = 1; i <= this.state.number; i++) {
      if (!this.contains(this.state.scratched, i)) {
        arr.push(i)
      }
    }
    return arr.map(this.renderFirst.bind(this))
  }

  addSecond(e) {
    var parsedE = parseInt(e.target.value, 10);
    if (this.contains(this.state.second, parsedE)) {
      var i = this.state.second.indexOf(parsedE);
      if (i > -1) {
        var array = this.state.second;
        array.splice(i, 1)
        this.setState({second: array});
      }
    } else {
      var new_second = this.state.second.concat(parsedE)
      this.setState({second: new_second})
    }
  }

  renderSecond(a, i) {
    return (
      <div key={'seconds' + i} className="scratch-box">
        <input key={'secondss' + i} type="checkbox" name="second" value={a} onChange={this.addSecond.bind(this)} checked={this.contains(this.state.second, a)}/>
        <p className="scratch-p" key={'secondsss' + i}>{a}</p>
      </div>
    )
  }

  renderSecondSelects() {
    var arr = [];
    for (var i = 1; i <= this.state.number; i++) {
      if (!this.contains(this.state.scratched, i)) {
        arr.push(i)
      }
    }
    return arr.map(this.renderSecond.bind(this))
  }

  addThird(e) {
    var parsedE = parseInt(e.target.value, 10);
    if (this.contains(this.state.third, parsedE)) {
      var i = this.state.third.indexOf(parsedE);
      if (i > -1) {
        var array = this.state.third;
        array.splice(i, 1)
        this.setState({third: array});
      }
    } else {
      var new_third = this.state.third.concat(parsedE)
      this.setState({third: new_third})
    }
  }

  renderThird(a, i) {
    return (
      <div key={'thirds' + i} className="scratch-box">
        <input key={'thirdss' + i} type="checkbox" name="third" value={a} onChange={this.addThird.bind(this)} checked={this.contains(this.state.third, a)}/>
        <p className="scratch-p" key={'thirdsss' + i}>{a}</p>
      </div>
    )
  }

  renderThirdSelects() {
    var arr = [];
    for (var i = 1; i <= this.state.number; i++) {
      if (!this.contains(this.state.scratched, i)) {
        arr.push(i)
      }
    }
    return arr.map(this.renderThird.bind(this))
  }

  renderSteps() {
    if (this.state.step === 1) {
      return (
        <div className="step">
          <h3>Enter Race Name</h3>
          <input placeholder="Horse Race Name" onChange={this.horseRaceName.bind(this)} value={this.state.name}/>
          <button type="button" onClick={this.moveForward.bind(this)}>Next</button>
          {this.renderError()}
        </div>
      )
    } else if (this.state.step === 2) {
      return (
        <div className="step">
          <h3>Enter Number of Horses</h3>
          <select onChange={this.number.bind(this)} defaultValue={(this.state.number)}>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
            <option value={14}>14</option>
            <option value={15}>15</option>
            <option value={16}>16</option>
            <option value={17}>17</option>
            <option value={18}>18</option>
            <option value={19}>19</option>
            <option value={20}>20</option>
            <option value={21}>21</option>
          </select>
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={this.moveForward.bind(this)}>Next</button>
          </div>
        </div>
      )
    } else if (this.state.step === 3) {
      return (
        <div className="step">
          <h3>Scratched</h3>
          <form>
            {this.renderScratches()}
          </form>
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={this.moveForward.bind(this)}>Next</button>
          </div>
        </div>
      )
    } else if (this.state.step === 4) {
      return (
        <div className="step">
          <h3>Play Type</h3>
          <div className="playtype-box">
            <input type="radio" name="play" value="Trifecta" onChange={this.playType.bind(this)} checked={(this.state.playType === 'Trifecta')}/>
            <p className="scratch-p">Trifecta</p>
          </div>
          <div className="playtype-box">
            <input type="radio" name="play" value="Superfecta" onChange={this.playType.bind(this)} checked={(this.state.playType === 'Superfecta')}/>
            <p className="scratch-p">Superfecta</p>
          </div>
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={this.moveForward.bind(this)}>Next</button>
          </div>
          {this.renderError()}
        </div>
      )
    } else if (this.state.step === 5) {
      return (
        <div className="step">
          <h3>First</h3>
          {this.renderFirstSelects()}
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={this.moveForward.bind(this)}>Next</button>
          </div>
        </div>
      )
    } else if (this.state.step === 6) {
      return (
        <div className="step">
          <h3>Second</h3>
          {this.renderSecondSelects()}
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={(this.state.playType === 'Superfecta')
              ? this.moveForward.bind(this)
              : this.moveSubmit.bind(this)}>{(this.state.playType === 'Superfecta')
                ? 'Next'
                : 'Submit'}</button>
          </div>
        </div>
      )
    } else if (this.state.step === 7 && this.state.playType === 'Superfecta') {
      return (
        <div className="step">
          <h3>Third</h3>
          {this.renderThirdSelects()}
          <div>
            <button type="button" onClick={this.moveBackward.bind(this)}>Back</button>
            <button type="button" onClick={this.moveSubmit.bind(this)}>Submit</button>
          </div>
        </div>
      )
    }
  }

  renderBillboard() {
    return (
      <div className="step">
        <p>{'Race Name: ' + this.state.name}</p>
        <p>{(this.state.step < 3)
            ? 'Number of Horses: '
            : 'Number of Horses: ' + this.state.number}</p>
        <p>{'Scratched: ' + this.state.scratched}</p>
        <p>{'Play Type: ' + this.state.playType}</p>
        <p>{'First: ' + this.state.first}</p>
        <p>{'Second: ' + this.state.second}</p>
        {(this.state.playType === 'Superfecta')
          ? <p>{'Third: ' + this.state.third}</p>
          : ''}
      </div>
    )
  }

  renderCombo(a, i) {
    if (a.length > 3) {
      return (
        <div key={'combo' + i}>
          <p key={'comboo' + i}>{i+1 + ': ' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3]}</p>
        </div>
      )
    }
    return (
      <div key={'combo' + i}>
        <p key={'comboo' + i}>{i+1 + ': ' + a[0] + ', ' + a[1] + ', ' + a[2]}</p>
      </div>
    )
  }

  renderCalulation(a, i) {
    return (
      <div className="calc" key={'calc' + i}>
        <p key={'calcc' + i}>{'Race Name: ' + a.name}</p>
        <p key={'calccc' + i}>{'Number of Horses: ' + a.number}</p>
        <p key={'calcccc' + i}>{'Scratched: ' + a.scratched}</p>
        <p key={'calccccc' + i}>{'Play Type: ' + a.playType}</p>
        <p key={'calcccccc' + i}>{'First: ' + a.first}</p>
        <p key={'calccccccc' + i}>{'Second: ' + a.second}</p>
        {(a.playType === 'Superfecta')
          ? <p key={'cal' + i}>{'Third: ' + a.third}</p>
          : ''}
        <p>Combos:</p>
        {a.combo.map(this.renderCombo.bind(this))}
      </div>
    )
  }

  renderCalculations() {
    return this.state.race.map(this.renderCalulation.bind(this))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Horse Racing Combinatorics</h2>
        </div>
        {this.renderBillboard()}
        {this.renderSteps()}
        {(this.state.race.length > 0)
          ? <div className="results-header">
              <h3>Results</h3>
            </div>
          : ''}
        {this.renderCalculations()}
      </div>
    )
  }
}

export default App;
