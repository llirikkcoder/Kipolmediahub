import React from 'react';
import './getData.css';
import  { Multiselect } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
import { withFormik } from 'formik';
import KPparser from './index';
import metafilm from 'metafilm';
import request from 'request'
import cheerio from 'cheerio'
import needle from 'needle'
import rp from 'request-promise'




// metafilm.id({tmdb_id: '299534', tmdb_key: '1b5adf76a72a13bad99b8fc0c68cb085'}).then(movie => {
//   console.log(movie);
// }).catch(console.error);

// {
//   titleRus: "Анна", 
//   titleOrig: "Anna", 
//   desc: "История Анны, чья несравненная красота скрывает по…носный талант опаснейшего наемного убийцы в мире.", 
//   year: "2019", 
//   countries: Array(2),
//   actors: ["Саша Лусс", "Хелен Миррен", "Люк Эванс", "Киллиан Мёрфи", "Лера Абова", "Александр Петров", "Никита Павленко", "Анна Криппа", "Алексей Маслодудов", "Эрик Годон"],
//   age: "зрителям, достигшим 18 лет",
//   artists: ["Юг Тиссандье", "Жиль Буалло", "Стефан Робюшон"],
//   composers: ["Эрик Серра"],
//   countries: ["Франция", "США"],
//   desc: "История Анны, чья несравненная красота скрывает поразительную мощь и смертоносный талант опаснейшего наемного убийцы в мире.",
//   directors: ["Люк Бессон"],
//   genres: ["боевик", "триллер"],
//   mounting: ["Жюльен Рей"],
//   operators: ["Тьерри Арбогаст"],
//   producers: ["Люк Бессон", "Джейсон Клот", "Эрик Мэтис"],
//   ratingIMDb: "6.70",
//   ratingKP: "5.952",
//   screenwriters: ["Люк Бессон"],
//   slogan: "«Никогда не делай оружие мишенью»",
//   time: "119 мин.",
//   titleOrig: "Anna",
//   titleRus: "Анна",
//   year: "2019",
// }
  

// let film_state = {
//   "countries": ["Сша","Великобритания"],
//   "serial": true,
//   "description": "История о группе гиков, готовящих к запуску собственные стартапы в высокотехнологичном центре Сан-Франциско. Главные герои сериала бесплатно проживают в доме местного миллионера, но взамен им придётся отдать по 10% прибыли от будущих проектов.",
//   "imdb_id": null,
//   "genres": ["Комедия"],
//   "kinopoisk_id": 723959,
//   "slug": "igra-prestolov",
//   "title": "Силиконовая долина",
//   "title_orig": "Silicon Valley",
//   "year": 2014,
//   "updated_at": "2019-03-29 00:00:42",
//   "background_url": "https://img.gazeta.ru/files3/885/5985885/kinopoisk.ru-Silicon-Valley-2323951.jpg",
//   "bell": true,
// };   

class GetForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      countries: [],
      description: '',
      // "imdb_id",
      genres: [],
      kinopoisk_id: '',
      slug: '',
      title: '',
      title_orig: '',           
      year: '',
      // "updated_at",
      // "background_url",
      title_alternative: '',
      producer: [],
      screenwriter: [],
      role: [],
      ipldHash: '', 
      fromKinopoisk: '',
      kinoIds: []  
    };
  }
  
  componentDidMount() {
    let ids = []
    let namesOrig = []
    needle('get', 'https://www.kinopoisk.ru/lists/m_act%5Bgenre%5D/3/')
      .then(function(res) {
        var $ = cheerio.load(res.body)
        const item = $('.tenItems .item')
        
        item.each((i, val) =>{
            ids.push(($(val).attr('id')).slice(3))
        })
        const names = $('.tenItems .name span')//.text()
        names.each((i, val) =>{
            namesOrig.push($(val).text().split(' (')[0])
        })
        console.log('Внутри метода:', JSON.stringify(namesOrig))

        // async function main() {
        //   await this.setState({
        //     kinoIds: namesOrig
        //   })
        //   console.log('namesOrig', this.state.kinoIds)
        // }
        // main()
      })
      .catch(function(err) {
        if (err) throw err;
      });
      
      ///////////////////////////////////////////

  //   const URL = 'https://www.kinopoisk.ru/lists/m_act%5Bgenre%5D/3/';
  //   let ids = []

  //   request(URL, (err, res) => {
  //     if (err) throw err;

  //     var $ = cheerio.load(res.body)
  //     //console.log($('.tenItems').text())
  //     let item = $('.tenItems .item')
  //     item.each((i, val) =>{
  //       ids.push(($(val).attr('id')).slice(3))
  //     })
  //     this.setState({kinoIds: ids})
  //     console.log('kinoIds in state:', this.state.kinoIds)
  //     this.setState({kinoIds: ids})
  //     console.log('kinoIds[0] from state:', this.state.kinoIds[0])
  //   });

  // const myParser = new KPparser(); 
  //   myParser.parseKinopoiskFilm('389') 
  //     .then((res)=>{  
  //       //this.setState({fromKinopoisk: res.titleOrig})
  //       console.log('res', res)
  //     }).catch((err)=>{
  //       console.log(`err: ${err}`);
  //     });
  }


  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    });
  }
  
  render() {

  let genres = ['драма ', 'мелодрама ', 'комедия ', 'экшн '];
  let countries = ['Россия', 'США', 'Франция','Италия', 'Великобритания', 'Германия'];
  let producer = [];
  let screenwriter = [];
  let role = [];
  
    return (
      <div className="personData">

      <form >
        {/* <legend>Введите название фильма, жанр и год выпуска:</legend> */}
        <input type="text" value={this.state.kinopoisk_id} name="kinopoisk_id" placeholder="id Kinopoisk" onChange={this.handleChange} />
        <br />
        <input type="text" value={this.state.ipldHash} name="ipldHash" placeholder="ipld hash from id Kinopisk" onChange={this.handleChange} />
        <br />
        <input style={{width: '268px', 'margin-right': '22px'}} type="text" value={this.state.title} name="title" placeholder="Название фильма на русском" onChange={this.handleChange} />
        <input style={{width: '268px', 'margin-right': '22px'}} type="text" value={this.state.title_alternative} name="title_alternative" placeholder="Альтернативное название" onChange={this.handleChange} />
        <br />
        <input type="text" value={this.state.title_orig} name="title_orig" placeholder="Оригинальное название фильма" onChange={this.handleChange} />      
        <br />
        <input type="text" value={this.state.slug} name="slug" placeholder="Слоган" onChange={this.handleChange} />
        <br />
        <input style={{width: '268px', 'margin-right': '22px'}} type="text" value={this.state.lenght} name="lenght" placeholder="Длительность" onChange={this.handleChange} />
        <input style={{width: '268px'}} type="text" value={this.state.year} name="year" placeholder="Год выпуска" onChange={this.handleChange} />
        <br />
        <Multiselect
          data={countries}
          value={this.state.countries}
          onChange={countries => this.setState({ countries })}
          placeholder="Страны"
        />
        <br />
        <Multiselect
          data={genres}
          value={this.state.genres}
          onChange={genres => this.setState({ genres })}
          placeholder="Жанры"
        />
        <br />
        <Multiselect
          data={producer}
          value={this.state.producer}
          onChange={producer => this.setState({ producer })}
          placeholder="Режиссеры"
        />
        <br />
        <Multiselect
          data={screenwriter}
          value={this.state.screenwriter}
          onChange={screenwriter => this.setState({ screenwriter })}
          placeholder="Сценаристы"
        />
        <br />
        <Multiselect
          data={role}
          value={this.state.role}
          onChange={role => this.setState({ role })}
          placeholder="Роли"
        />
        <br />
        <textarea className='film_description' name="description"style={{width: '558px', height: '134px', padding: '15px'}} value ={this.state.description} placeholder="Полное описание" onChange={this.handleChange} ></textarea>
        
        {/* <h1>{this.state.title} {this.state.genre} {this.state.year}</h1> */}
      </form>

      <legend>JSON:</legend>
      <textarea value ={JSON.stringify(this.state)} style={{width: '558px', height: '134px', padding: '15px'}} ></textarea>

      </div>
    );
  }
}

const GetData = withFormik ({
  // mapPropsToValues() {
  //   return {
  //     email: 'test text'
  //   }
  // }
})(GetForm)

export default GetData;
