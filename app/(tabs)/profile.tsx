import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert, TextInput, Switch, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Trophy,
  Link2,
  Crown,
  Star,
  LogOut,
  ChevronRight,
  Trash2,
  PlusCircle,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Reusable input component for our forms
const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#999"
    />
  </View>
);

// Example form for Personal Details
const PersonalDetailsForm = ({ user, onSave }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [location, setLocation] = useState(''); // Location isn't on the default user object

  const handleSave = () => {
    // In a real app, you'd call an API to save this data.
    // For now, we'll just log it and call the onSave prop.
    const updatedDetails = { displayName: name, phoneNumber: phone, location };
    console.log('Saving personal details:', updatedDetails);
    onSave(updatedDetails);
    Alert.alert('Success', 'Personal details saved!');
  };

  return (
    <View>
      <FormInput label="Full Name" value={name} onChangeText={setName} placeholder="e.g., Jane Doe" />
      <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g., +1 123 456 7890" keyboardType="phone-pad" />
      <FormInput label="Location" value={location} onChangeText={setLocation} placeholder="e.g., San Francisco, CA" />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// Form for adding and managing Education
const EducationForm = () => {
  const degreeTypes = ['High School', 'Diploma', 'B.E', 'B.Tech', 'M.E', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'PhD', 'Other'];

  const [education, setEducation] = useState([
    { id: 1, institution: 'State University', degree: 'B.Tech in Computer Science', field: 'Computer Science', endDate: 'May 2021' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [field, setField] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddEducation = () => {
    if (!institution || !degree) {
      Alert.alert('Missing Fields', 'Please fill in at least Institution and Degree.');
      return;
    }
    const fullDegree = (degree !== 'High School' && degree !== 'Diploma' && field) ? `${degree} in ${field}` : degree;
    setEducation(prev => [...prev, { id: Date.now(), institution, degree: fullDegree, field, endDate }]);
    setInstitution('');
    setDegree('B.Tech');
    setField('');
    setEndDate('');
    setIsAdding(false);
  };

  const handleRemoveEducation = (id: number) => {
    Alert.alert('Delete Education', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setEducation(edu => edu.filter(e => e.id !== id)) },
    ]);
  };

  return (
    <View>
      {education.map(edu => (
        <View key={edu.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{edu.institution}</Text>
            <Text style={styles.listItemSubtitle}>{edu.degree}</Text>
            <Text style={styles.listItemSubtitle}>Graduated: {edu.endDate}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveEducation(edu.id)}>
            <Trash2 color="#e74c3c" size={20} />
          </TouchableOpacity>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.subFormContainer}>
          <FormInput label="School / College / University" value={institution} onChangeText={setInstitution} placeholder="e.g., State University" />
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Degree Type</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.dropdownButtonText}>{degree}</Text>
              <ChevronDown color="#555" size={20} />
            </TouchableOpacity>
          </View>

          {degree !== 'High School' && degree !== 'Diploma' && (
            <FormInput label="Field of Study" value={field} onChangeText={setField} placeholder="e.g., Computer Science" />
          )}

          <FormInput label="Graduation Date" value={endDate} onChangeText={setEndDate} placeholder="e.g., May 2021" />

          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
              <View style={styles.modalContent}>
                <FlatList
                  data={degreeTypes}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalItem} onPress={() => { setDegree(item); setIsModalVisible(false); }}>
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity style={styles.saveButton} onPress={handleAddEducation}>
            <Text style={styles.saveButtonText}>Save Education</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <PlusCircle color="#667eea" size={22} />
          <Text style={styles.addButtonText}>Add New Education</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Form for adding and managing Projects
const ProjectsForm = () => {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');

  const handleAddProject = () => {
    if (!name) {
      Alert.alert('Missing Field', 'Please provide a project name.');
      return;
    }
    const newProject = { id: Date.now(), name, description, liveLink, githubLink };
    setProjects(prev => [...prev, newProject]);
    setName('');
    setDescription('');
    setLiveLink('');
    setGithubLink('');
    setIsAdding(false);
  };

  const handleRemoveProject = (id: number) => {
    Alert.alert('Delete Project', 'Are you sure you want to delete this project?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setProjects(p => p.filter(proj => proj.id !== id)) },
    ]);
  };

  return (
    <View>
      {projects.map(proj => (
        <View key={proj.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{proj.name}</Text>
            <Text style={styles.listItemSubtitle} numberOfLines={2}>{proj.description}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveProject(proj.id)}>
            <Trash2 color="#e74c3c" size={20} />
          </TouchableOpacity>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.subFormContainer}>
          <FormInput label="Project Name" value={name} onChangeText={setName} placeholder="e.g., Reslio App" />
          <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="A brief summary of your project" />
          <FormInput label="Live Link (Optional)" value={liveLink} onChangeText={setLiveLink} placeholder="https://..." keyboardType="url" />
          <FormInput label="GitHub Link (Optional)" value={githubLink} onChangeText={setGithubLink} placeholder="https://github.com/..." keyboardType="url" />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddProject}>
            <Text style={styles.saveButtonText}>Save Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <PlusCircle color="#667eea" size={22} />
          <Text style={styles.addButtonText}>Add New Project</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Form for adding and managing Achievements
const AchievementsForm = () => {
  const achievementTypes = ['Award', 'Certification', 'Publication', 'Patent', 'Honor', 'Other'];

  const [achievements, setAchievements] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Certification');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');

  const handleAddAchievement = () => {
    if (!title) {
      Alert.alert('Missing Field', 'Please provide a name for the achievement.');
      return;
    }
    const newAchievement = { id: Date.now(), title, type, issuer, date };
    setAchievements(prev => [...prev, newAchievement]);
    setTitle('');
    setType('Certification');
    setIssuer('');
    setDate('');
    setIsAdding(false);
  };

  const handleRemoveAchievement = (id: number) => {
    Alert.alert('Delete Achievement', 'Are you sure you want to delete this achievement?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setAchievements(a => a.filter(ach => ach.id !== id)) },
    ]);
  };

  return (
    <View>
      {achievements.map(ach => (
        <View key={ach.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{ach.title}</Text>
            <Text style={styles.listItemSubtitle}>{ach.type} {ach.issuer && `from ${ach.issuer}`}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveAchievement(ach.id)}>
            <Trash2 color="#e74c3c" size={20} />
          </TouchableOpacity>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.subFormContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Achievement Type</Text>
            <View style={styles.typeSelectorContainer}>
              {achievementTypes.map(achType => (
                <TouchableOpacity
                  key={achType}
                  style={[styles.typeButton, type === achType && styles.typeButtonSelected]}
                  onPress={() => setType(achType)}
                ><Text style={[styles.typeButtonText, type === achType && styles.typeButtonTextSelected]}>{achType}</Text></TouchableOpacity>
              ))}
            </View>
          </View>
          <FormInput label="Name" value={title} onChangeText={setTitle} placeholder="e.g., Certified Cloud Practitioner" />
          <FormInput label="Issuing Body (Optional)" value={issuer} onChangeText={setIssuer} placeholder="e.g., Amazon Web Services" />
          <FormInput label="Date (Optional)" value={date} onChangeText={setDate} placeholder="e.g., March 2023" />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddAchievement}>
            <Text style={styles.saveButtonText}>Save Achievement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <PlusCircle color="#667eea" size={22} />
          <Text style={styles.addButtonText}>Add New Achievement</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Form for adding and managing Contact & Links
const ContactLinksForm = () => {
  const linkTypes = ['LinkedIn', 'GitHub', 'Portfolio', 'Website', 'Twitter', 'Blog', 'Other'];

  const [links, setLinks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const [type, setType] = useState('LinkedIn');
  const [url, setUrl] = useState('');

  const handleAddLink = () => {
    if (!type || !url) {
      Alert.alert('Missing Fields', 'Please provide both a type and a URL.');
      return;
    }
    const newLink = { id: Date.now(), type, url };
    setLinks(prev => [...prev, newLink]);
    setType('LinkedIn');
    setUrl('');
    setIsAdding(false);
  };

  const handleRemoveLink = (id: number) => {
    Alert.alert('Delete Link', 'Are you sure you want to delete this link?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setLinks(l => l.filter(link => link.id !== id)) },
    ]);
  };

  return (
    <View>
      {links.map(link => (
        <View key={link.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{link.type}</Text>
            <Text style={styles.listItemSubtitle} numberOfLines={1}>{link.url}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveLink(link.id)}>
            <Trash2 color="#e74c3c" size={20} />
          </TouchableOpacity>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.subFormContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Link Type</Text>
            <View style={styles.typeSelectorContainer}>
              {linkTypes.map(linkType => (
                <TouchableOpacity
                  key={linkType}
                  style={[styles.typeButton, type === linkType && styles.typeButtonSelected]}
                  onPress={() => setType(linkType)}
                ><Text style={[styles.typeButtonText, type === linkType && styles.typeButtonTextSelected]}>{linkType}</Text></TouchableOpacity>
              ))}
            </View>
          </View>
          <FormInput label="URL" value={url} onChangeText={setUrl} placeholder="https://..." keyboardType="url" />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddLink}>
            <Text style={styles.saveButtonText}>Save Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <PlusCircle color="#667eea" size={22} />
          <Text style={styles.addButtonText}>Add New Link</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Form for adding and managing Experience
const ExperienceForm = () => {
  // In a real app, this would be fetched from your backend
  const experienceTypes = ['Job', 'Internship', 'Freelance', 'Webinar', 'Volunteering', 'Other'];

  const [experiences, setExperiences] = useState([
    { id: 1, position: 'Software Engineer', company: 'Tech Corp', type: 'Job', startDate: 'Jan 2022', endDate: 'Present', description: 'Developed and maintained web applications.' },
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('Job'); // e.g., Job, Internship, Webinar, Freelance
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExperience = () => {
    if (!position || !company) {
      Alert.alert('Missing Fields', 'Please fill in at least Position and Company.');
      return;
    }
    const newExperience = {
      id: Date.now(),
      position,
      company,
      type,
      startDate,
      endDate: isCurrent ? 'Present' : endDate,
      description,
      salary,
    };
    setExperiences(prev => [...prev, newExperience]);
    // Reset form and hide it
    setPosition('');
    setCompany('');
    setType('Job');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setSalary('');
    setDescription('');
    setIsAdding(false);
  };

  const handleRemoveExperience = (id: number) => {
    Alert.alert('Delete Experience', 'Are you sure you want to delete this experience?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setExperiences(exps => exps.filter(exp => exp.id !== id)) },
    ]);
  };

  return (
    <View>
      {experiences.map(exp => (
        <View key={exp.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{exp.position}</Text>
            <Text style={styles.listItemSubtitle}>{exp.company} ({exp.type})</Text>
            <Text style={styles.listItemSubtitle}>{exp.startDate} - {exp.endDate}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveExperience(exp.id)}>
            <Trash2 color="#e74c3c" size={20} />
          </TouchableOpacity>
        </View>
      ))}

      {isAdding ? (
        <View style={styles.subFormContainer}>
          <FormInput label="Position / Title" value={position} onChangeText={setPosition} placeholder="e.g., Lead Developer" />
          <FormInput label="Company / Organization" value={company} onChangeText={setCompany} placeholder="e.g., Innovate Inc." />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Experience Type</Text>
            <View style={styles.typeSelectorContainer}>
              {experienceTypes.map(expType => (
                <TouchableOpacity
                  key={expType}
                  style={[styles.typeButton, type === expType && styles.typeButtonSelected]}
                  onPress={() => setType(expType)}
                ><Text style={[styles.typeButtonText, type === expType && styles.typeButtonTextSelected]}>{expType}</Text></TouchableOpacity>
              ))}
            </View>
          </View>
          {type.toLowerCase() === 'job' && (
            <FormInput label="Salary (Optional)" value={salary} onChangeText={setSalary} placeholder="e.g., $120,000 per year" />
          )}
          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <FormInput label="Start Date" value={startDate} onChangeText={setStartDate} placeholder="e.g., Jan 2020" />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <FormInput label="End Date" value={isCurrent ? 'Present' : endDate} onChangeText={setEndDate} placeholder="e.g., Dec 2022" editable={!isCurrent} />
            </View>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.inputLabel}>I currently work here</Text>
            <Switch value={isCurrent} onValueChange={setIsCurrent} trackColor={{ false: "#767577", true: "#667eea" }} thumbColor={"#f4f3f4"} />
          </View>
          <FormInput label="Description (Optional)" value={description} onChangeText={setDescription} placeholder="Your responsibilities and achievements..." />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddExperience}>
            <Text style={styles.saveButtonText}>Save Experience</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <PlusCircle color="#667eea" size={22} />
          <Text style={styles.addButtonText}>Add New Experience</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Placeholder for other forms
const PlaceholderForm = ({ title }) => (
  <View style={styles.placeholderForm}>
    <Text style={styles.placeholderText}>This is where the form for "{title}" will be.</Text>
    <Text style={styles.placeholderSubText}>You can add, edit, and remove items here.</Text>
  </View>
);

export default function ProfileTab() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRateApp = async () => {
    const playStoreUrl = 'https://play.google.com/store/apps'; // Replace with your app's URL
    try {
      const supported = await Linking.canOpenURL(playStoreUrl);
      if (supported) {
        await Linking.openURL(playStoreUrl);
      } else {
        Alert.alert("Can't open Play Store");
      }
    } catch (error) {
      console.error('Error opening Play Store:', error);
    }
  };

  const menuItems = [
    { icon: User, text: 'Personal Details', screen: '/profile/details' },
    { icon: Briefcase, text: 'Experience', screen: '/profile/experience' },
    { icon: GraduationCap, text: 'Education', screen: '/profile/education' },
    { icon: Lightbulb, text: 'Projects', screen: '/profile/projects' },
    { icon: Trophy, text: 'Achievements', screen: '/profile/achievements' },
    { icon: Link2, text: 'Contact & Links', screen: '/profile/links' },
  ];

  const actionItems = [
    { icon: Crown, text: 'Upgrade to Premium', action: () => Alert.alert('Premium', 'Navigate to premium screen.'), color: '#FFD700' },
    { icon: Star, text: 'Rate Us on Play Store', action: handleRateApp, color: '#667eea' },
    { icon: LogOut, text: 'Sign Out', action: handleSignOut, color: '#e74c3c' },
  ];

  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleMenuItemPress = (screenKey: string) => {
    setOpenSection(prev => (prev === screenKey ? null : screenKey));
  };

  const renderFormForSection = (screenKey: string, title: string) => {
    switch (screenKey) {
      case '/profile/details':
        return <PersonalDetailsForm user={user} onSave={(details) => {
          // Here you would update your user object, maybe via a context update
          // or a call to your backend, then refetch the user.
          console.log("Updated details received in parent:", details);
        }} />;
      case '/profile/experience':
        return <ExperienceForm />;
      case '/profile/education':
        return <EducationForm />;
      case '/profile/projects':
        return <ProjectsForm />;
      case '/profile/achievements':
        return <AchievementsForm />;
      case '/profile/links':
        return <ContactLinksForm />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.profileSection}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.displayName?.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Manage Your Information</Text>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItemContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item.screen)}>
                <item.icon color="#555" size={22} />
                <Text style={styles.menuItemText}>{item.text}</Text>
                <ChevronRight color="#ccc" size={20} style={{ transform: [{ rotate: openSection === item.screen ? '90deg' : '0deg' }] }} />
              </TouchableOpacity>
              {openSection === item.screen && (
                <View style={styles.formContainer}>
                  {renderFormForSection(item.screen, item.text)}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {actionItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
              <item.icon color={item.color} size={22} />
              <Text style={styles.menuItemText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#667eea',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  menuSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  menuItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderForm: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  placeholderSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  // Styles for ExperienceForm
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667eea',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  subFormContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonSelected: {
    backgroundColor: '#e8eaf6',
    borderColor: '#667eea',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#667eea',
    fontWeight: '700',
  },
  // Dropdown Modal Styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});