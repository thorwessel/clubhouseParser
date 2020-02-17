import React, { Component } from 'react'
import CSVReader from 'react-csv-reader'
import { Ticket } from '../../types/ticket';

interface State {
    csv: Array<String>
    labels: Array<Label>
}

interface Label {
    name: labelName
    count: number
}

enum labelName {
    lowPriority = "Low priority",
    mediumPriority = "Medium priority",
    highPriority = "High priority",
    autoTopUp = "autotop-up",
    missingReceipts = "missing_receipt",
    integrations = "integrations",
    exports = "exports",
    transactions = "transactions"
}


class Reader extends Component {

    state: State = {
        csv: [],
        labels: [
            { name: labelName.lowPriority, count: 0 },
            { name: labelName.mediumPriority, count: 0 },
            { name: labelName.highPriority, count: 0 },
            { name: labelName.autoTopUp, count: 0 },
            { name: labelName.missingReceipts, count: 0 },
            { name: labelName.integrations, count: 0 },
            { name: labelName.exports, count: 0 },
            { name: labelName.transactions, count: 0 }
        ]
    }
   
    papaparseOptions: any = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header: string) =>
        header
          .toLowerCase()
          .replace(/\W/g, '_')
    };



    handleForce = (data: any, fileName: any) => {
        console.log(data, fileName);
        this.setState({
            csv: data
        })

        this.countLabels(data)
    }

    countLabels = (data: Array<Ticket>) => {
        data.forEach((row) => {
            if(row.labels != null) {
                this.checkLabelName(row)
            }
        })        
    }

    checkLabelName = (row: Ticket) => {
        Object.values(labelName).forEach(element => {
            if (row.labels.includes(element)) {
                this.handleClick(element)
            }
        });
    }

    handleClick = (label: labelName): void => {

        let currentLabels = this.state.labels
        let index = this.findState(label)
        if (index != null) {
            currentLabels[index].count += 1
        
            this.setState({
                labels: currentLabels
            })
        }
    }

    findState = (label: labelName) => {
        const correctState = this.state.labels.findIndex(obj => obj.name === label)
        return correctState
    }

   
    render() {
        const dataStats = this.state.labels.map(function(data, idx) {
            return <p key={idx}>{data.name}: {data.count}</p>;
            });

        if (this.state.csv) {
            return (
                <>
                    <CSVReader
                        cssClass="csv-reader-input"
                        label="Select CSV with secret Death Star statistics"
                        onFileLoaded={this.handleForce}
                        parserOptions={this.papaparseOptions}
                        inputId="ObiWan"
                        inputStyle={{color: 'red'}}
                    />

                    <p>Total tickets: {this.state.csv.length}</p>
                    {dataStats}
                </>
            )
        }
    }
  }

  export default Reader;