// ManualProfileEditor.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    Alert, 
    TextInput, 
    Switch, 
    Modal, 
    FlatList, // Still used for Modal content, but not main view
    KeyboardTypeOptions, 
    ScrollView, // Main container changed to ScrollView
    Platform, 
    LayoutAnimation, 
    UIManager 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Briefcase, GraduationCap, Lightbulb, Trophy, Link2, ChevronRight, Trash2, PlusCircle, ChevronDown } from 'lucide-react-native';

// NOTE: Placeholder components below (LocationInput, DatePickerInput) are replaced 
// with standard TextInput fields for the purposes of a complete, runnable code block.

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Type Definitions ---
interface PersonalDetails {
    name?: string;
    phone?: string;
    location?: string;
}

interface Experience { _id?: string; position: string; company: string; type: string; startDate?: string; endDate?: string; description?: string; salary?: string; }
interface Education { _id?: string; institution: string; degree: string; field?: string; endDate?: string; }
interface Project { _id?: string; name: string; description?: string; liveLink?: string; githubLink?: string; }
interface Achievement { _id?: string; name: string; description?: string; }
interface ContactLink { _id?: string; name: string; url: string; }

// --- Reusable FormInput Component ---
const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true }: { label: string, value: string, onChangeText: (text: string) => void, placeholder: string, keyboardType?: KeyboardTypeOptions, editable?: boolean }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor="#999"
            editable={editable}
            multiline={label.includes('Description')}
            numberOfLines={label.includes('Description') ? 3 : 1}
        />
    </View>
);

interface FormComponentProps {
    data: any;
    onUpdate: (data: any) => void;
}

// --- Individual Form Components ---

const PersonalDetailsForm: React.FC<FormComponentProps> = ({ data, onUpdate }) => {
    const [name, setName] = useState(data?.name || '');
    const [phone, setPhone] = useState(data?.phone || '');
    const [location, setLocation] = useState(data?.location || '');

    useEffect(() => {
        setName(data?.name || '');
        setPhone(data?.phone || '');
        setLocation(data?.location || '');
    }, [data]);

    useEffect(() => {
        onUpdate({ name, phone, location });
    }, [name, phone, location]);

    return (
        <View>
            <FormInput label="Full Name" value={name} onChangeText={setName} placeholder="e.g., Jane Doe" />
            <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g., +1 123 456 7890" keyboardType="phone-pad" />
            <FormInput label="Location" value={location} onChangeText={setLocation} placeholder="e.g., San Francisco, CA" />
        </View>
    );
};

const ExperienceForm: React.FC<FormComponentProps> = ({ data: experienceList, onUpdate }) => {
    const experienceTypes = ['Job', 'Internship', 'Freelance', 'Volunteering', 'Other'];
    const [experiences, setExperiences] = useState(experienceList || []);
    const [isAdding, setIsAdding] = useState(false);

    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [type, setType] = useState('Job');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setExperiences(experienceList || []);
    }, [experienceList]);

    const resetForm = () => {
        setPosition(''); setCompany(''); setType('Job'); setStartDate(''); setEndDate('');
        setIsCurrent(false); setSalary(''); setDescription('');
    };

    const handleAddExperience = () => {
        if (!position || !company || !startDate || (!isCurrent && !endDate)) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        const newExperienceEntry: Experience = {
            position, company, type, startDate,
            endDate: isCurrent ? 'Present' : endDate,
            description, salary,
        };
        onUpdate([...experiences, newExperienceEntry]);
        resetForm();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(false);
    };

    const handleRemoveExperience = (indexToRemove: number) => {
        Alert.alert('Delete Experience', 'Are you sure you want to delete this experience?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onUpdate(experiences.filter((_, index) => index !== indexToRemove));
            }},
        ]);
    };
    
    const handleToggleAddForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(prev => {
            if (prev) resetForm();
            return !prev;
        });
    };

    return (
        <View>
            {experiences.map((exp, index) => (
                <View key={exp._id || index} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{exp.position}</Text>
                        <Text style={styles.listItemSubtitle}>{exp.company} ({exp.type})</Text>
                        <Text style={styles.listItemSubtitle}>{exp.startDate} - {exp.endDate}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveExperience(index)}><Trash2 color="#e74c3c" size={20} /></TouchableOpacity>
                </View>
            ))}
            {isAdding ? (
                <View style={styles.subFormContainer}>
                    <FormInput label="Position / Title" value={position} onChangeText={setPosition} placeholder="e.g., Lead Developer" />
                    <FormInput label="Company / Organization" value={company} onChangeText={setCompany} placeholder="e.g., Innovate Inc." />
                    <View style={styles.inputGroup}><Text style={styles.inputLabel}>Experience Type</Text><View style={styles.typeSelectorContainer}>{experienceTypes.map(expType => (<TouchableOpacity key={expType} style={[styles.typeButton, type === expType && styles.typeButtonSelected]} onPress={() => setType(expType)}><Text style={[styles.typeButtonText, type === expType && styles.typeButtonTextSelected]}>{expType}</Text></TouchableOpacity>))}</View></View>
                    {type.toLowerCase() === 'job' && (<FormInput label="Salary (Optional)" value={salary} onChangeText={setSalary} placeholder="e.g., ₹12,00,000 per year" />)}
                    <View style={styles.dateRow}>
                        <View style={{ flex: 1, marginRight: 5 }}><FormInput label="Start Date (MM/YYYY)" value={startDate} onChangeText={setStartDate} placeholder="01/2020" /></View>
                        <View style={{ flex: 1, marginLeft: 5 }}><FormInput label="End Date (MM/YYYY)" value={isCurrent ? 'Present' : endDate} onChangeText={setEndDate} placeholder="01/2024" editable={!isCurrent} /></View>
                    </View>
                    <View style={styles.switchContainer}><Text style={styles.inputLabel}>I currently work here</Text><Switch value={isCurrent} onValueChange={(val) => { setIsCurrent(val); if (val) setEndDate('Present'); }} trackColor={{ false: "#767577", true: "#3498db" }} thumbColor={"#f4f3f4"} /></View>
                    <FormInput label="Description (Optional)" value={description} onChangeText={setDescription} placeholder="Your responsibilities and achievements..." />
                    <TouchableOpacity style={styles.saveButton} onPress={handleAddExperience}><Text style={styles.saveButtonText}>Save Experience</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleToggleAddForm}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleToggleAddForm}><PlusCircle color="#3498db" size={22} /><Text style={styles.addButtonText}>Add New Experience</Text></TouchableOpacity>
            )}
        </View>
    );
};

const EducationForm: React.FC<FormComponentProps> = ({ data: educationList, onUpdate }) => {
    const degreeTypes = ['High School', 'Diploma', 'B.E', 'B.Tech', 'M.E', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'PhD', 'Other'];
    const [education, setEducation] = useState(educationList || []);
    const [isAdding, setIsAdding] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [institution, setInstitution] = useState('');
    const [degree, setDegree] = useState('B.Tech');
    const [field, setField] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => { setEducation(educationList || []); }, [educationList]);

    const resetForm = () => {
        setInstitution(''); setDegree('B.Tech'); setField(''); setEndDate('');
    }

    const handleAddEducation = () => {
        if (!institution || !degree || !endDate) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        const newEducation: Education = { institution, degree, field, endDate };
        onUpdate([...education, newEducation]);
        resetForm();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(false);
    };

    const handleRemoveEducation = (indexToRemove: number) => {
        Alert.alert('Delete Education', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onUpdate(education.filter((_, i) => i !== indexToRemove))
            }},
        ]);
    };
    
    const handleToggleAddForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(prev => {
            if (prev) resetForm();
            return !prev;
        });
    };

    const renderModalItem = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.modalItem} onPress={() => { setDegree(item); setIsModalVisible(false); }}>
            <Text style={styles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            {education.map((edu, index) => (
                <View key={edu._id || index} style={styles.listItem}><View style={styles.listItemContent}><Text style={styles.listItemTitle}>{edu.institution}</Text><Text style={styles.listItemSubtitle}>{edu.degree}</Text><Text style={styles.listItemSubtitle}>Graduated: {edu.endDate}</Text></View><TouchableOpacity onPress={() => handleRemoveEducation(index)}><Trash2 color="#e74c3c" size={20} /></TouchableOpacity></View>
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
                    {degree !== 'High School' && degree !== 'Diploma' && (<FormInput label="Field of Study" value={field} onChangeText={setField} placeholder="e.g., Computer Science" />)}
                    <FormInput label="Graduation Date (MM/YYYY)" value={endDate} onChangeText={setEndDate} placeholder="05/2024" />
                    
                    <Modal transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
                        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                            <View style={styles.modalContent}>
                                <FlatList 
                                    data={degreeTypes} 
                                    renderItem={renderModalItem} 
                                    keyExtractor={(item) => item}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>

                </View>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleToggleAddForm}><PlusCircle color="#3498db" size={22} /><Text style={styles.addButtonText}>Add New Education</Text></TouchableOpacity>
            )}
            {isAdding && <><TouchableOpacity style={styles.saveButton} onPress={handleAddEducation}><Text style={styles.saveButtonText}>Add Education Entry</Text></TouchableOpacity><TouchableOpacity style={styles.cancelButton} onPress={handleToggleAddForm}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity></>}
        </View>
    );
};

const ProjectsForm: React.FC<FormComponentProps> = ({ data: projectsList, onUpdate }) => {
    const [projects, setProjects] = useState(projectsList || []);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');

    useEffect(() => { setProjects(projectsList || []); }, [projectsList]);

    const resetForm = () => {
        setName(''); setDescription(''); setLiveLink(''); setGithubLink('');
    };

    const handleAddProject = () => {
        if (!name) { Alert.alert('Missing Field', 'Please provide a project name.'); return; }
        const newProject: Project = { name, description, liveLink, githubLink };
        onUpdate([...projects, newProject]);
        resetForm();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(false);
    };

    const handleRemoveProject = (indexToRemove: number) => {
        Alert.alert('Delete Project', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onUpdate(projects.filter((_, i) => i !== indexToRemove))
            }},
        ]);
    };

    const handleToggleAddForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(prev => {
            if (prev) resetForm();
            return !prev;
        });
    };

    return (
        <View>
            {projects.map((proj, index) => (
                <View key={proj._id || index} style={styles.listItem}><View style={styles.listItemContent}><Text style={styles.listItemTitle}>{proj.name}</Text><Text style={styles.listItemSubtitle} numberOfLines={2}>{proj.description}</Text></View><TouchableOpacity onPress={() => handleRemoveProject(index)}><Trash2 color="#e74c3c" size={20} /></TouchableOpacity></View>
            ))}
            {isAdding ? (
                <View style={styles.subFormContainer}>
                    <FormInput label="Project Name" value={name} onChangeText={setName} placeholder="e.g., Reslio App" />
                    <FormInput label="Description" value={description} onChangeText={setDescription} placeholder="A brief summary of your project" />
                    <FormInput label="Live Link (Optional)" value={liveLink} onChangeText={setLiveLink} placeholder="https://..." keyboardType="url" />
                    <FormInput label="GitHub Link (Optional)" value={githubLink} onChangeText={setGithubLink} placeholder="https://github.com/..." keyboardType="url" />
                </View>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleToggleAddForm}><PlusCircle color="#3498db" size={22} /><Text style={styles.addButtonText}>Add New Project</Text></TouchableOpacity>
            )}
            {isAdding && <><TouchableOpacity style={styles.saveButton} onPress={handleAddProject}><Text style={styles.saveButtonText}>Add Project Entry</Text></TouchableOpacity><TouchableOpacity style={styles.cancelButton} onPress={handleToggleAddForm}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity></>}
        </View>
    );
};

const AchievementsForm: React.FC<FormComponentProps> = ({ data: achievementsList, onUpdate }) => {
    const [achievements, setAchievements] = useState(achievementsList || []);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => { setAchievements(achievementsList || []); }, [achievementsList]);

    const resetForm = () => {
        setName(''); setDescription('');
    };

    const handleAddAchievement = () => {
        if (!name) { Alert.alert('Missing Field', 'Please provide a name.'); return; }
        const newAchievement: Achievement = { name, description };
        onUpdate([...achievements, newAchievement]);
        resetForm();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(false);
    };

    const handleRemoveAchievement = (indexToRemove: number) => {
        Alert.alert('Delete Achievement', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onUpdate(achievements.filter((_, i) => i !== indexToRemove))
            }},
        ]);
    };

    const handleToggleAddForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(prev => {
            if (prev) resetForm();
            return !prev;
        });
    };

    return (
        <View>
            {achievements.map((ach, index) => (
                <View key={ach._id || index} style={styles.listItem}><View style={styles.listItemContent}><Text style={styles.listItemTitle}>{ach.name}</Text>{ach.description && <Text style={styles.listItemSubtitle}>{ach.description}</Text>}</View><TouchableOpacity onPress={() => handleRemoveAchievement(index)}><Trash2 color="#e74c3c" size={20} /></TouchableOpacity></View>
            ))}
            {isAdding ? (
                <View style={styles.subFormContainer}>
                    <FormInput label="Name" value={name} onChangeText={setName} placeholder="e.g., Certified Cloud Practitioner" />
                    <FormInput label="Description (Optional)" value={description} onChangeText={setDescription} placeholder="e.g., Amazon Web Services" />
                </View>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleToggleAddForm}><PlusCircle color="#3498db" size={22} /><Text style={styles.addButtonText}>Add New Achievement</Text></TouchableOpacity>
            )}
            {isAdding && <><TouchableOpacity style={styles.saveButton} onPress={handleAddAchievement}><Text style={styles.saveButtonText}>Add Achievement Entry</Text></TouchableOpacity><TouchableOpacity style={styles.cancelButton} onPress={handleToggleAddForm}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity></>}
        </View>
    );
};

const ContactLinksForm: React.FC<FormComponentProps> = ({ data: linksList, onUpdate }) => {
    const linkTypes = ['LinkedIn', 'GitHub', 'Portfolio', 'Website', 'Twitter', 'Blog', 'Other'];
    const [links, setLinks] = useState(linksList || []);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('LinkedIn');
    const [url, setUrl] = useState('');

    useEffect(() => { setLinks(linksList || []); }, [linksList]);

    const resetForm = () => {
        setName('LinkedIn'); setUrl('');
    };

    const handleAddLink = () => {
        if (!name || !url) { Alert.alert('Missing Fields', 'Please provide both a type and a URL.'); return; }
        const newLink: ContactLink = { name, url };
        onUpdate([...links, newLink]);
        resetForm();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(false);
    };

    const handleRemoveLink = (indexToRemove: number) => {
        Alert.alert('Delete Link', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onUpdate(links.filter((_, i) => i !== indexToRemove))
            }},
        ]);
    };

    const handleToggleAddForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAdding(prev => {
            if (prev) resetForm();
            return !prev;
        });
    };

    return (
        <View>
            {links.map((link, index) => (
                <View key={link._id || index} style={styles.listItem}><View style={styles.listItemContent}><Text style={styles.listItemTitle}>{link.name}</Text><Text style={styles.listItemSubtitle} numberOfLines={1}>{link.url}</Text></View><TouchableOpacity onPress={() => handleRemoveLink(index)}><Trash2 color="#e74c3c" size={20} /></TouchableOpacity></View>
            ))}
            {isAdding ? (
                <View style={styles.subFormContainer}>
                    <View style={styles.inputGroup}><Text style={styles.inputLabel}>Link Type</Text><View style={styles.typeSelectorContainer}>{linkTypes.map(linkType => (<TouchableOpacity key={linkType} style={[styles.typeButton, name === linkType && styles.typeButtonSelected]} onPress={() => setName(linkType)}><Text style={[styles.typeButtonText, name === linkType && styles.typeButtonTextSelected]}>{linkType}</Text></TouchableOpacity>))}</View></View>
                    <FormInput label="URL" value={url} onChangeText={setUrl} placeholder="https://..." keyboardType="url" />
                </View>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={handleToggleAddForm}><PlusCircle color="#3498db" size={22} /><Text style={styles.addButtonText}>Add New Link</Text></TouchableOpacity>
            )}
            {isAdding && <><TouchableOpacity style={styles.saveButton} onPress={handleAddLink}><Text style={styles.saveButtonText}>Add Link Entry</Text></TouchableOpacity><TouchableOpacity style={styles.cancelButton} onPress={handleToggleAddForm}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity></>}
        </View>
    );
};


// --- Main Component ---

interface ManualProfileEditorProps {
    dbUser: any;
    firebaseUser: any;
    onSave: (updatedProfile: any) => Promise<void>;
    actionItems: any[];
}

const ManualProfileEditor = ({ dbUser, firebaseUser, onSave, actionItems }: ManualProfileEditorProps) => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [editableProfile, setEditableProfile] = useState(dbUser);

    useEffect(() => {
        setEditableProfile(dbUser);
    }, [dbUser]);

    const handleUpdateSection = (sectionKey: string, data: any) => {
        const updatedProfile = { ...editableProfile, [sectionKey]: data };
        setEditableProfile(updatedProfile);
    };

    const menuSections = [
        { key: 'personalDetails', icon: User, text: 'Personal Details' },
        { key: 'experience', icon: Briefcase, text: 'Experience' },
        { key: 'education', icon: GraduationCap, text: 'Education' },
        { key: 'projects', icon: Lightbulb, text: 'Projects' },
        { key: 'achievements', icon: Trophy, text: 'Achievements' },
        { key: 'contactLinks', icon: Link2, text: 'Contact & Links' },
    ];

    const listData = [
        
        { type: 'sectionTitle', key: 'sectionTitle', text: 'Manage Your Information' },
        ...menuSections.map(item => ({ ...item, type: 'menuItem' })),
        { type: 'sectionTitle', key: 'footerTitle', text: 'App Settings' },
        { type: 'saveAll', key: 'saveAll' },
        ...actionItems.map((item, index) => ({ ...item, type: 'actionItem', key: `action-${index}` })),
    ];

    const handleMenuItemPress = (screenKey: string) => {
        // Apply smooth transition effect on state change
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        setOpenSection(prev => (prev === screenKey ? null : screenKey));
    };

    const renderFormForSection = (screenKey: string) => {
        switch (screenKey) {
            case 'personalDetails':
                return <PersonalDetailsForm data={editableProfile?.personalDetails} onUpdate={(data) => handleUpdateSection('personalDetails', data)} />;
            case 'experience':
                return <ExperienceForm data={editableProfile?.experience} onUpdate={(data) => handleUpdateSection('experience', data)} />;
            case 'education':
                return <EducationForm data={editableProfile?.education} onUpdate={(data) => handleUpdateSection('education', data)} />;
            case 'projects':
                return <ProjectsForm data={editableProfile?.projects} onUpdate={(data) => handleUpdateSection('projects', data)} />;
            case 'achievements':
                return <AchievementsForm data={editableProfile?.achievements} onUpdate={(data) => handleUpdateSection('achievements', data)} />;
            case 'contactLinks':
                return <ContactLinksForm data={editableProfile?.contactLinks} onUpdate={(data) => handleUpdateSection('contactLinks', data)} />;
            default:
                return null;
        }
    };

    const ListHeader = () => (
        
            <View style={styles.profileSection}>
                {firebaseUser?.photoURL ? (
                    <Image source={{ uri: firebaseUser.photoURL }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{firebaseUser?.displayName?.charAt(0).toUpperCase()}</Text></View>
                )}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{dbUser?.personalDetails?.name || firebaseUser?.displayName}</Text>
                    <Text style={styles.userEmail}>{firebaseUser?.email}</Text>
                </View>
            </View>
        
    );

    const renderListItem = (item: any) => {
        switch (item.type) {
            case 'header':
                return <ListHeader key={item.key} />;
            case 'sectionTitle':
                return <Text style={[styles.sectionTitle, { marginTop: 20 }]} key={item.key}>{item.text}</Text>;
            case 'menuItem':
                return (
                    <View style={styles.menuItemContainer} key={item.key}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item.key)} key={`${item.key}-touchable`}>
                            <item.icon color="#555" size={22} />
                            <Text style={styles.menuItemText}>{item.text}</Text>
                            <ChevronRight 
                                color="#ccc" 
                                size={20} 
                                style={{ transform: [{ rotate: openSection === item.key ? '90deg' : '0deg' }] }} 
                            />
                        </TouchableOpacity>
                        {/* Conditional Form View (Animated by LayoutAnimation) */}
                        {openSection === item.key && (
                            <View style={styles.formContainer}>
                                {renderFormForSection(item.key)}
                            </View>
                        )}
                    </View>
                );
            case 'actionItem':
                return (
                    <TouchableOpacity key={item.key} style={[styles.menuItem, styles.actionItemContainer]} onPress={item.action}>
                        <item.icon color={item.color} size={22} />
                        <Text style={styles.menuItemText}>{item.text}</Text>
                    </TouchableOpacity>
                );
            case 'saveAll':
                return (
                    <TouchableOpacity style={styles.saveAllButton} onPress={() => onSave(editableProfile)} key={item.key}>
                        <Text style={styles.saveAllButtonText}>Save All Changes</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            // Add bounce and smooth scrolling behavior
            showsVerticalScrollIndicator={false}
        >
            {listData.map(renderListItem)}
        </ScrollView>
    );
}

export default ManualProfileEditor;


const styles = StyleSheet.create({
  // --- Global Container & Header ---
  container: {
    flex: 1,
    
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
    color: '#3498db', // Use primary blue for text on white avatar
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
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 15, // Slightly reduced horizontal padding
    paddingBottom: 30,
  },

  // --- Menu & Sections ---
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700', // Bolder title
    color: '#7f8c8d', // Muted dark gray
    marginBottom: 8, // Smaller margin for tighter grouping
    marginTop: 25,
    textTransform: 'uppercase',
  },
  
  // Menu Item Wrappers (Card Styles)
  menuItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8, // Smaller margin for tighter grouping
    // Soft, unified shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, 
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  actionItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50', // Darker text for readability
  },
  
  // --- Forms ---
  formContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1', // Lighter divider
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#bdc3c7', // Subtle border
    textAlignVertical: 'top', // For multiline text
  },
  saveAllButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveAllButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // --- Buttons ---
  saveButton: {
    backgroundColor: '#3498db', // Primary blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // --- List Items (Experience/Education Cards) ---
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderLeftWidth: 4, // Visual accent
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemContent: {
    flex: 1,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  
  // --- Sub Form Elements ---
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
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  typeButtonSelected: {
    backgroundColor: '#e8f6ff',
    borderColor: '#3498db',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#3498db',
    fontWeight: '700',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12, 
    width: '90%',
    maxHeight: '70%',
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
    color: '#2c3e50',
  },

  // --- Mode Switcher Styles ---
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#bdc3c7', // Muted background
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, 
    shadowRadius: 3,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#3498db',
    fontWeight: '700',
  },
});