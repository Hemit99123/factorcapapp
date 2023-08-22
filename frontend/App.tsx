import { Text, SafeAreaView, StyleSheet, Button, Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { useState } from 'react'
import SVGImage from './components/SVGImage';

export default function App() {
  interface Fact {
    text: string;
    id: string;
  }

  interface FactParams {
    id: string,
    verify: boolean
  }

  interface Vote {
    verifiedCount: number,
    unverifiedCount: number
  }

  const [facts, setFacts] = useState<Fact[]>([])
  const [showStats, setshowStats] = useState(false)
  const [stats, setStats] = useState<Vote[]>([])

  const fetchData = async () => {
    if(showStats) {
      setshowStats(false)
    }
    const response = await fetch(`https://uselessfacts.jsph.pl/api/v2/facts/random`, {
      method: "GET",
    });

    const fact = await response.json(); // Fetch a single fact object
    setFacts([fact]); // Store the fetched fact in an array
  }

  const resetData = () => {
    setFacts([]);
    setshowStats(false)
  }

  const createVote = async (params: FactParams) => {
    try {
      const response = await fetch('http://localhost:3000/createvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type
        },
        body: JSON.stringify({ factID: params.id, verified: params.verify }), 
      });
  
      if (response.ok) {
        // Success: The fact was created successfully
        setshowStats(true)
        showVoteResults({id: params.id, verify: params.verify})
      } else {
        // Error: Handle the error scenario
        console.error('Failed to create fact');
      }
    } catch (error) {
      // Exception: Handle any exception that occurs during the API call
      console.error('An error occurred:', error);
    }
  };

  const showVoteResults = async (params: FactParams) => {
    try {
      const response = await fetch(`http://localhost:3000/getvotes`, {
        method: 'POST',  // Change to POST method
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ factID: params.id })  // Send factID in the request body
      });
  
      if (response.ok) {
        const voteResults = await response.json();
        setStats([voteResults]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>Fact or Cap?</Text>
      <Text style={styles.label}>Let's see how you do.</Text>
      <Button onPress={fetchData} title="Get the fact " />
      <Button onPress={resetData} title='Reset screen' />

      {facts.map((fact, index) => (
        <View key={index}>
          <View style={styles.imageContainer}>
            <Image
              source={require('./assets/logo.png')} 
              resizeMode="contain" 
            />
          </View>
          <View style={styles.factItem}>
            <Text style={styles.factText}>
              {fact.text}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => {createVote({id: fact.id, verify: true})}} >
              <Text style={styles.buttonText}>Fact</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>OR!</Text>
            <TouchableOpacity style={styles.button} onPress={() => {createVote({id: fact.id, verify: false})}}>
              <Text style={styles.buttonText}>Cap</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {showStats &&

      <View>
        {stats.map((item, index) => (
          <View key={index}>
          <Text>{item.verifiedCount} {item.verifiedCount === 1 ? 'person agrees': 'people agree'} with this fact</Text>
          <Text>{item.unverifiedCount} {item.unverifiedCount === 1 ? 'person does not agree': 'people do not agree'} with this fact</Text>
        </View>
        ))}
      </View>
    }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 20,
    fontSize: 40,
    fontWeight: 'bold',
  },
  header: {
    margin: 20,
    fontSize: 22,
    fontWeight: 'bold'
  },
  imageContainer: {
    backgroundColor: '#3778bb',
    padding: 20,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  button: {
    paddingVertical: 15, // Adjust vertical padding
    paddingHorizontal: 30, // Adjust horizontal padding to make the button longer
    borderRadius: 5,
    backgroundColor: '#3778bb',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  orText: {
    marginRight: 6,
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 25
  },
  label: {
    margin: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },
  factItem: {
    borderWidth: 4, // Increase the borderWidth to make it bold
    borderColor: '#3778bb',
    padding: 25,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  factText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  factTextCenter: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  factTextCenterWhite: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'black',
    padding: 10
  }
});