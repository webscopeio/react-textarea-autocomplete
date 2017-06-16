# React Textarea Autocomplete

## Development

Run `yarn install` to fetch dependencies.

Run `yarn dev` for real time transpiling of source-code.

In the folder run `yarn link` in your project then `yarn link react-textarea-autocomplete`

## Example of use
```javascript
import ReactTextareaAutocomplete from 'react-textarea-autocomplete'

const TestComponent = ({ entity }) => <div>swag: {entity}</div>;
const SmileItemComponent = ({ entity: { label, text } }) => <div style={{ background: 'pink' }}>{label}</div>;
const Loading = () => <div>Loading...</div>;


<ReactTextareaAutocomplete
    placeholder={'Write a message.'}
    value={'Controlled text'}
    onChange={e => console.log('On change event: ', e)}
    style={{ background: 'red' }}
    loadingComponent={Loading}
    trigger={
        {
            '@': {
                dataProvider: token => new Promise(res => setTimeout(() => res(['kuba', 'erik', 'adolf']), 1000)),
                component: TestComponent,
            },
            ':': {
                output: (item, trigger) => `___${item.text}___`,
                dataProvider: token =>
                    new Promise(res =>
                        setTimeout(() => 
                            res([
                                { id: 1, label: ':D', text: 'lol' },
                                { id: 2, label: ':)', text: 'very_lol' }
                            ]),
                        1000)
                    ),
                component: SmileItemComponent,
            }
        }
    } />
````

## License

<img src="https://media.giphy.com/media/AuIvUrZpzBl04/giphy.gif" width="500">

MIT
