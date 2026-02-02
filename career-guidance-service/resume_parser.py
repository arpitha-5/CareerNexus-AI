"""
Resume Parser Module
====================
Extracts text, skills, education, experience, and keywords from PDF resumes.
Uses PyPDF2/pdfplumber for PDF parsing and regex/keyword matching for extraction.

Author: CareerNexus AI
"""

import re
import PyPDF2
import pdfplumber
from typing import Dict, List, Set

# ============================================
# COMPREHENSIVE SKILLS DATABASE
# ============================================

SKILLS_DATABASE = {
    # Programming Languages
    'programming': [
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 
        'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab',
        'perl', 'shell', 'bash', 'powershell', 'sql', 'html', 'css'
    ],
    
    # Data Science & ML
    'data_science': [
        'machine learning', 'deep learning', 'neural networks', 'nlp', 
        'computer vision', 'data analysis', 'data visualization', 'statistics',
        'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
        'matplotlib', 'seaborn', 'tableau', 'power bi', 'excel', 'spark',
        'hadoop', 'kafka', 'airflow', 'mlflow', 'kubeflow'
    ],
    
    # Web Development
    'web_development': [
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'spring boot', 'asp.net', 'laravel', 'rails', 'fastapi', 'next.js',
        'nuxt', 'gatsby', 'svelte', 'tailwind', 'bootstrap', 'sass', 'webpack',
        'vite', 'redux', 'graphql', 'rest api', 'microservices'
    ],
    
    # Database
    'database': [
        'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
        'dynamodb', 'oracle', 'sql server', 'sqlite', 'firebase', 'neo4j'
    ],
    
    # Cloud & DevOps
    'cloud_devops': [
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab ci',
        'github actions', 'terraform', 'ansible', 'circleci', 'travis ci',
        'prometheus', 'grafana', 'elk stack', 'nagios', 'nginx', 'apache'
    ],
    
    # Mobile Development
    'mobile': [
        'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin',
        'xamarin', 'ionic', 'cordova'
    ],
    
    # Business & Soft Skills
    'soft_skills': [
        'leadership', 'communication', 'teamwork', 'problem solving',
        'project management', 'agile', 'scrum', 'kanban', 'jira',
        'analytical thinking', 'critical thinking', 'presentation',
        'negotiation', 'time management'
    ],
    
    # Testing & Quality
    'testing': [
        'unit testing', 'integration testing', 'selenium', 'jest', 'pytest',
        'junit', 'cypress', 'postman', 'jmeter', 'quality assurance'
    ]
}

# Flatten all skills for easy searching
ALL_SKILLS = set()
for category_skills in SKILLS_DATABASE.values():
    ALL_SKILLS.update([skill.lower() for skill in category_skills])

# ============================================
# ATS KEYWORDS (HIGH-VALUE KEYWORDS)
# ============================================

ATS_KEYWORDS = [
    # Action verbs
    'developed', 'designed', 'implemented', 'created', 'built', 'managed',
    'led', 'architected', 'optimized', 'improved', 'achieved', 'delivered',
    'collaborated', 'analyzed', 'researched', 'launched', 'established',
    
    # Results-oriented
    'increased', 'decreased', 'reduced', 'enhanced', 'streamlined',
    'accelerated', 'generated', 'saved', 'won', 'exceeded',
    
    # Technical terms
    'api', 'database', 'algorithm', 'framework', 'architecture',
    'deployment', 'scalable', 'performance', 'security', 'automation'
]

# ============================================
# EDUCATION KEYWORDS
# ============================================

EDUCATION_KEYWORDS = [
    'bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.tech', 'm.tech',
    'b.e', 'm.e', 'b.sc', 'm.sc', 'bca', 'mca', 'diploma',
    'computer science', 'information technology', 'engineering',
    'university', 'college', 'institute', 'gpa', 'cgpa', 'percentage'
]

# ============================================
# EXPERIENCE KEYWORDS
# ============================================

EXPERIENCE_KEYWORDS = [
    'experience', 'work history', 'employment', 'internship', 'project',
    'years', 'months', 'intern', 'developer', 'engineer', 'analyst',
    'manager', 'consultant', 'specialist', 'coordinator', 'lead'
]


class ResumeParser:
    """
    Resume Parser class that extracts structured information from PDF resumes.
    """
    
    def __init__(self):
        """Initialize the resume parser."""
        self.text = ""
        self.skills = set()
        self.education = []
        self.projects = []
        self.experience = []
        self.keywords = set()
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from PDF resume using PyPDF2 and pdfplumber.
        Falls back to alternative method if one fails.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text as string
        """
        text = ""
        
        # Method 1: Try pdfplumber (better for complex layouts)
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if text.strip():
                return text.lower()  # Lowercase for easier matching
        except Exception as e:
            print(f"pdfplumber failed: {e}")
        
        # Method 2: Fallback to PyPDF2
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            return text.lower()
        except Exception as e:
            print(f"PyPDF2 failed: {e}")
            raise Exception("Failed to extract text from PDF using both methods")
    
    def extract_skills(self, text: str) -> Set[str]:
        """
        Extract skills from resume text using keyword matching.
        
        Args:
            text: Resume text (lowercase)
            
        Returns:
            Set of found skills
        """
        found_skills = set()
        
        # Search for each skill in the text
        for skill in ALL_SKILLS:
            # Use word boundaries to avoid partial matches
            # e.g., 'python' should match but not be found in 'pythonic'
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                found_skills.add(skill.title())  # Capitalize for display
        
        return found_skills
    
    def extract_education(self, text: str) -> List[str]:
        """
        Extract education information from resume text.
        
        Args:
            text: Resume text (lowercase)
            
        Returns:
            List of education entries found
        """
        education = []
        
        # Look for education section
        education_section_pattern = r'education.*?(?=experience|projects|skills|$)'
        education_match = re.search(education_section_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if education_match:
            education_text = education_match.group(0)
            
            # Extract degrees
            for keyword in EDUCATION_KEYWORDS:
                if keyword in education_text:
                    # Extract lines containing the keyword
                    lines = education_text.split('\n')
                    for line in lines:
                        if keyword in line.lower() and len(line.strip()) > 5:
                            education.append(line.strip().title())
        
        return education[:5]  # Limit to 5 entries
    
    def extract_projects(self, text: str) -> List[str]:
        """
        Extract project information from resume text.
        
        Args:
            text: Resume text (lowercase)
            
        Returns:
            List of project entries found
        """
        projects = []
        
        # Look for projects section
        projects_pattern = r'projects?.*?(?=experience|education|skills|$)'
        projects_match = re.search(projects_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if projects_match:
            projects_text = projects_match.group(0)
            
            # Split by common separators
            # Look for bullet points or numbered lists
            project_entries = re.split(r'[•\-\*\d+\.]', projects_text)
            
            for entry in project_entries:
                entry = entry.strip()
                if len(entry) > 20 and len(entry) < 300:  # Reasonable project description length
                    projects.append(entry.title())
        
        return projects[:5]  # Limit to 5 projects
    
    def extract_experience(self, text: str) -> List[str]:
        """
        Extract work experience from resume text.
        
        Args:
            text: Resume text (lowercase)
            
        Returns:
            List of experience entries found
        """
        experience = []
        
        # Look for experience section
        experience_pattern = r'experience.*?(?=education|projects|skills|$)'
        experience_match = re.search(experience_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if experience_match:
            experience_text = experience_match.group(0)
            
            # Extract job titles and companies
            for keyword in EXPERIENCE_KEYWORDS:
                if keyword in experience_text:
                    lines = experience_text.split('\n')
                    for line in lines:
                        if any(role in line.lower() for role in ['developer', 'engineer', 'analyst', 'intern', 'manager']):
                            if len(line.strip()) > 10:
                                experience.append(line.strip().title())
        
        return experience[:5]  # Limit to 5 entries
    
    def extract_keywords(self, text: str) -> Set[str]:
        """
        Extract ATS-friendly keywords from resume text.
        
        Args:
            text: Resume text (lowercase)
            
        Returns:
            Set of ATS keywords found
        """
        found_keywords = set()
        
        for keyword in ATS_KEYWORDS:
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                found_keywords.add(keyword.title())
        
        return found_keywords
    
    def parse(self, pdf_path: str) -> Dict:
        """
        Main parsing method - extracts all information from resume.
        
        Args:
            pdf_path: Path to PDF resume file
            
        Returns:
            Dictionary containing all extracted information
        """
        # Extract text from PDF
        self.text = self.extract_text_from_pdf(pdf_path)
        
        # Extract all components
        self.skills = self.extract_skills(self.text)
        self.education = self.extract_education(self.text)
        self.projects = self.extract_projects(self.text)
        self.experience = self.extract_experience(self.text)
        self.keywords = self.extract_keywords(self.text)
        
        # Calculate basic statistics
        word_count = len(self.text.split())
        has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', self.text))
        has_phone = bool(re.search(r'\b\d{10}\b|\b\(\d{3}\)\s*\d{3}-\d{4}\b', self.text))
        
        return {
            'text': self.text,
            'skills': list(self.skills),
            'education': self.education,
            'projects': self.projects,
            'experience': self.experience,
            'keywords': list(self.keywords),
            'stats': {
                'word_count': word_count,
                'skills_count': len(self.skills),
                'keywords_count': len(self.keywords),
                'has_contact_info': has_email and has_phone
            }
        }


# ============================================
# UTILITY FUNCTIONS
# ============================================

def get_all_skills() -> List[str]:
    """Return complete list of all tracked skills."""
    return sorted(list(ALL_SKILLS))

def get_skills_by_category() -> Dict[str, List[str]]:
    """Return skills organized by category."""
    return SKILLS_DATABASE
