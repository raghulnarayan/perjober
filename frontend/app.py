import streamlit as st
import requests
import pandas as pd
import time
import altair as alt
import base64
import uuid
import os
from datetime import datetime, date, timedelta
from urllib.parse import quote 

# --- CALENDAR IMPORT ---
try:
    from streamlit_calendar import calendar
    HAS_CALENDAR = True
except ImportError:
    HAS_CALENDAR = False

# ==========================================
# ⚙️ CONFIGURATION & CONSTANTS
# ==========================================
BACKEND_URL = "http://127.0.0.1:8001"

st.set_page_config(
    page_title="Mission Masters", 
    layout="wide", 
    initial_sidebar_state="expanded"
)

# ==========================================
# 🎥 LIVE VIDEO BACKGROUND FUNCTION
# ==========================================
def set_video_background(video_file):
    """
    Sets a local video file as the background of the Streamlit app.
    """
    # Check current directory or 'frontend' subdirectory
    if os.path.exists(video_file):
        filepath = video_file
    elif os.path.exists(os.path.join("frontend", video_file)):
        filepath = os.path.join("frontend", video_file)
    else:
        st.warning(f"⚠️ Video file not found: {video_file}")
        return

    with open(filepath, "rb") as f:
        video_bytes = f.read()
        video_b64 = base64.b64encode(video_bytes).decode()
        
    st.markdown(
        f"""
        <style>
        .stApp {{
            background: transparent !important;
        }}
        #myVideo {{
            position: fixed;
            right: 0;
            bottom: 0;
            min-width: 100%; 
            min-height: 100%;
            z-index: -1;
            filter: brightness(0.6) blur(2px); /* Darken & slight blur for readability */
            object-fit: cover;
        }}
        /* Make standard Streamlit containers transparent */
        .css-1d391kg, .css-12oz5g7, [data-testid="stAppViewContainer"] {{
            background-color: transparent !important;
        }}
        /* Sidebar transparency (optional) */
        [data-testid="stSidebar"] {{
            background-color: rgba(20, 20, 25, 0.9) !important;
        }}
        </style>
        <video autoplay muted loop id="myVideo">
            <source src="data:video/mp4;base64,{video_b64}" type="video/mp4">
        </video>
        """,
        unsafe_allow_html=True
    )

# ==========================================
# 🎬 TRANSPARENT (GLASS) TITLE CARD
# ==========================================
def cinematic_title_card():
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');

        .cinematic-container {
            /* GLASSMOPHISM EFFECT */
            background: rgba(0, 0, 0, 0.4); /* 40% opacity black */
            backdrop-filter: blur(12px);     /* Blurs the video behind the title */
            -webkit-backdrop-filter: blur(12px);
            
            padding: 30px 20px;
            border-radius: 15px;
            text-align: center;
            
            /* Borders and Shadows */
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 215, 0, 0.2); /* Thin gold border */
            border-bottom: 3px solid rgba(255, 215, 0, 0.6); /* Gold underline */
            margin-bottom: 25px;
        }

        .cinematic-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 3.5em;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 6px;
            margin: 0;
            
            /* Brushed Gold Text */
            background: linear-gradient(to bottom, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.9));
        }

        .cinematic-subtitle {
            color: #f0f0f0;
            font-family: sans-serif;
            letter-spacing: 4px;
            font-size: 1.1em;
            margin-top: 10px;
            font-weight: bold;
            text-shadow: 0px 2px 4px rgba(0,0,0,0.8);
        }
        </style>

        <div class="cinematic-container">
            <h1 class="cinematic-title">MISSION MASTERS</h1>
            <div class="cinematic-subtitle">TRACK. EXECUTE. ACHIEVE.</div>
        </div>
        """,
        unsafe_allow_html=True
    )

# ==========================================
# 🔄 PERSISTENCE & SESSION
# ==========================================
if "logged_in_user" in st.query_params:
    if "user" not in st.session_state or st.session_state.user is None:
        st.session_state.user = st.query_params["logged_in_user"]
        st.session_state.page = "home"

if "page" not in st.session_state: st.session_state.page = "login"
if "user" not in st.session_state: st.session_state.user = None
if "temp_email" not in st.session_state: st.session_state.temp_email = None
if "reset_stage" not in st.session_state: st.session_state.reset_stage = 1
if "selected_topic" not in st.session_state: st.session_state.selected_topic = None

# ==========================================
# 🛠️ HELPER FUNCTIONS
# ==========================================
def parse_date(date_str):
    try: return datetime.strptime(str(date_str).split(" ")[0], "%Y-%m-%d").date()
    except: return datetime.now().date()

def format_date_display(date_obj):
    try:
        if isinstance(date_obj, str):
            date_obj = parse_date(date_obj)
        return date_obj.strftime("%d-%m-%Y")
    except: return str(date_obj)

def smart_post(endpoint, data, files=None):
    try: return requests.post(f"{BACKEND_URL}/{endpoint}", data=data, files=files, timeout=5)
    except: return None

@st.cache_data(ttl=300, show_spinner=False)
def fetch_jobs_cached(email):
    try:
        res = requests.get(f"{BACKEND_URL}/jobs/{email}", timeout=2) 
        if res.status_code == 200:
            return res.json()
    except: pass
    return []

def clear_job_cache():
    fetch_jobs_cached.clear()

def navigate_to_goals(topic_item):
    st.session_state.selected_topic = topic_item
    st.session_state.page = "goals"

# ==========================================
# 🚀 GLOBAL VISUALS (EXECUTES ON EVERY PAGE)
# ==========================================

# 1. Set Video Background (Looks for file in current dir or frontend folder)
video_filename = "5192-183786490_medium.mp4"
set_video_background(video_filename)

# 2. Show Transparent Title Card
cinematic_title_card()

# ==========================================
# 🔐 PAGE: LOGIN
# ==========================================
if st.session_state.page == "login":
    c1, c2, c3 = st.columns([1, 1, 1])
    with c2:
        # Using markdown container for semi-transparent backing on forms
        with st.container(border=True):
            st.markdown("### Login")
            email = st.text_input("Email", key="l_email", placeholder="name@company.com")
            password = st.text_input("Password", type="password", key="l_pass", placeholder="******")
            
            if st.button("Login", use_container_width=True):
                res = smart_post("login", {"email": email, "password": password})
                if res and res.status_code == 200:
                    st.query_params["logged_in_user"] = email
                    st.session_state.user = email
                    st.session_state.page = "home"
                    st.rerun()
                elif res and res.status_code == 401: st.error("Invalid Email or Password")
                elif res: st.error(f"Error: {res.json().get('detail', 'Unknown error')}")
                else: st.error("Backend connection failed.")

            st.markdown("---")
            if st.button("Forgot Password?", use_container_width=True):
                st.session_state.page = "forgot_password"; st.session_state.reset_stage = 1; st.rerun()
            if st.button("Create an account", use_container_width=True):
                st.session_state.page = "signup"; st.rerun()

# ==========================================
# 🔑 PAGE: FORGOT PASSWORD
# ==========================================
elif st.session_state.page == "forgot_password":
    c1, c2, c3 = st.columns([1, 1, 1])
    with c2:
        with st.container(border=True):
            st.markdown("### Reset Password")
            if st.session_state.reset_stage == 1:
                email = st.text_input("Email Address")
                if st.button("Send Reset Code", use_container_width=True):
                    if not email: st.error("Please enter email")
                    else:
                        res = smart_post("forgot-password-trigger", {"email": email})
                        if res and res.status_code == 200:
                            st.session_state.temp_email = email
                            st.session_state.reset_stage = 2
                            st.rerun()
                        else: st.error("Connection failed or User not found.")
                if st.button("Back to Login", use_container_width=True):
                    st.session_state.page = "login"; st.rerun()
            elif st.session_state.reset_stage == 2:
                otp = st.text_input("OTP")
                new_pass = st.text_input("New Password", type="password")
                if st.button("Reset & Login", use_container_width=True):
                    res = smart_post("reset-password", {"email": st.session_state.temp_email, "otp": otp, "new_password": new_pass})
                    if res and res.status_code == 200:
                        st.query_params["logged_in_user"] = st.session_state.temp_email
                        st.session_state.user = st.session_state.temp_email
                        st.session_state.page = "home"
                        st.rerun()
                    else: st.error("Invalid Code")

# ==========================================
# 📝 PAGE: SIGNUP
# ==========================================
elif st.session_state.page == "signup":
    c1, c2, c3 = st.columns([1, 1, 1])
    with c2:
        with st.container(border=True):
            st.markdown("### Sign up")
            n = st.text_input("Name")
            e = st.text_input("Email")
            p = st.text_input("Password", type="password")
            cp = st.text_input("Confirm Password", type="password")
            if st.button("Sign Up", use_container_width=True):
                if p != cp: st.error("Passwords do not match")
                elif not n or not e: st.error("Fill all fields")
                else:
                    res = smart_post("signup-trigger", {"name": n, "email": e, "password": p})
                    if res and res.status_code == 200:
                        st.session_state.temp_email = e
                        st.session_state.page = "otp"
                        st.rerun()
                    else: st.error("Error or User exists")
            if st.button("Back"): st.session_state.page = "login"; st.rerun()

# ==========================================
# 🔢 PAGE: OTP
# ==========================================
elif st.session_state.page == "otp":
    c1, c2, c3 = st.columns([1, 1, 1])
    with c2:
        with st.container(border=True):
            st.markdown("### Verification")
            otp = st.text_input("OTP Code")
            if st.button("Verify"):
                res = smart_post("verify-signup", {"email": st.session_state.temp_email, "otp": otp})
                if res and res.status_code == 200:
                    st.query_params["logged_in_user"] = st.session_state.temp_email
                    st.session_state.user = st.session_state.temp_email
                    st.session_state.page = "home"
                    st.rerun()
                else: st.error("Invalid Code")

# ==========================================
# 🎯 PAGE: GOAL DETAILS
# ==========================================
elif st.session_state.page == "goals":
    topic = st.session_state.selected_topic
    if not topic: st.session_state.page = "home"; st.rerun()

    c1, c2 = st.columns([1, 5])
    with c1:
        if st.button("← Back"): st.session_state.page = "home"; st.rerun()
    with c2: st.subheader(f"Goals: {topic.get('topic', 'Unknown')}")
    st.markdown("---")

    current_goals = topic.get('goals', [])
    if not isinstance(current_goals, list): current_goals = []
    achieved = [g for g in current_goals if g.get('done', False)]
    pending = [g for g in current_goals if not g.get('done', False)]

    def save_goals(topic_id, goals_list):
        try:
            clean = [{"id": g["id"], "task": g["task"], "done": g["done"]} for g in goals_list]
            requests.put(f"{BACKEND_URL}/study/{topic_id}/goals", json={"goals": clean})
        except: pass

    col1, col2 = st.columns(2)
    with col1:
        st.success(f"### Completed ({len(achieved)})")
        for g in achieved:
            if not st.checkbox(f"~~{g['task']}~~", value=True, key=f"done_{g['id']}"):
                for item in current_goals:
                    if item['id'] == g['id']: item['done'] = False; break
                topic['goals'] = current_goals; save_goals(topic['_id'], current_goals); st.rerun()
    with col2:
        st.warning(f"### Pending ({len(pending)})")
        for g in pending:
            if st.checkbox(g['task'], value=False, key=f"pend_{g['id']}"):
                for item in current_goals:
                    if item['id'] == g['id']: item['done'] = True; break
                topic['goals'] = current_goals; save_goals(topic['_id'], current_goals); st.rerun()

    st.markdown("---")
    with st.container(border=True):
        st.subheader("Add New Goal")
        c_in, c_btn = st.columns([4, 1])
        with c_in: new_task = st.text_input("New Sub-goal / Task", key="new_goal_inp")
        with c_btn:
            st.write(""); st.write("")
            if st.button("Add Task"):
                if new_task:
                    current_goals.append({"id": str(uuid.uuid4()), "task": new_task, "done": False})
                    topic['goals'] = current_goals; save_goals(topic['_id'], current_goals); st.success("Added!"); time.sleep(0.5); st.rerun()

# ==========================================
# 🏠 PAGE: HOME DASHBOARD
# ==========================================
elif st.session_state.page == "home":
    st.sidebar.title("User Profile")
    st.sidebar.write(f"📧 {st.session_state.user}")
    st.sidebar.markdown("---")
    if st.sidebar.button("Logout", use_container_width=True):
        st.session_state.user = None
        st.session_state.page = "login"
        st.query_params.clear()
        st.rerun()

    # --- 1. GLOBAL DATA FETCH ---
    study_data = []
    try:
        res = requests.get(f"{BACKEND_URL}/study/{st.session_state.user}")
        if res.status_code == 200:
            study_data = res.json()
    except: pass

    # --- 2. GLOBAL DATA CLEANING ---
    if study_data:
        df_master = pd.DataFrame(study_data)
        df_master["progress"] = pd.to_numeric(df_master["progress"], errors="coerce").fillna(0)
        df_master["start_date"] = pd.to_datetime(df_master["start_date"], errors="coerce")
    else:
        df_master = pd.DataFrame(columns=["topic", "subject", "status", "progress", "start_date"])

    tab1, tab2, tab3, tab4 = st.tabs(["Study Plan", "Progress", "Job Tracker", "Calendar"])

    # --- TAB 1: STUDY PLAN ---
    with tab1:
        with st.expander("Add New Topic", expanded=False):
            with st.form("new_study", clear_on_submit=True):
                c1, c2, c3, c4 = st.columns(4)
                t = c1.text_input("Topic Name")
                s = c2.text_input("Subject")
                stt = c3.selectbox("Status", ["to-do", "in-progress", "completed"])
                
                sub_c1, sub_c2 = c4.columns([1,1])
                prg = sub_c1.slider("Progress %", 0, 100, 0)
                start_dt = sub_c2.date_input("Start Date", value=datetime.now(), format="DD/MM/YYYY")

                st.markdown("---")
                c5, c6 = st.columns(2)
                f_uploads = c5.file_uploader("Attach Files", accept_multiple_files=True)
                links_input = c6.text_area("Study Links (One per line)")
                if st.form_submit_button("Add Topic"):
                    if len(f_uploads) > 5: st.error("Max 5 files allowed!")
                    else:
                        files_payload = [("files", f) for f in f_uploads] if f_uploads else None
                        final_prog = 100 if stt == "completed" else prg
                        try:
                            requests.post(f"{BACKEND_URL}/study", 
                                data={
                                    "user_email": st.session_state.user, 
                                    "topic": t, 
                                    "subject": s, 
                                    "status": stt, 
                                    "progress": final_prog, 
                                    "start_date": str(start_dt),
                                    "links": links_input, 
                                    "goals": []
                                }, 
                                files=files_payload
                            )
                            st.rerun()
                        except Exception as e: st.error(f"Error: {e}")

        st.subheader("Your Study Plan")
        cols = st.columns([2, 1, 1.5, 2, 1.5, 1, 1, 1])
        headers = ["Topic", "Subject", "Status", "Progress", "Materials", "Goal", "Save", "Delete"]
        for col, h in zip(cols, headers): col.markdown(f"**{h}**")
        st.markdown("---")

        if study_data:
            for item in study_data:
                c1, c2, c3, c4, c5, c6, c7, c8 = st.columns([2, 1, 1.5, 2, 1.5, 1, 1, 1], vertical_alignment="center")
                
                c1.markdown(f"**{item['topic']}**")
                if item.get('start_date'):
                    c1.caption(f"📅 Started: {format_date_display(item['start_date'])}")
                
                c2.write(item['subject'])
                new_stat = c3.selectbox("", ["to-do", "in-progress", "completed"], index=["to-do", "in-progress", "completed"].index(item['status']), key=f"s_{item['_id']}", label_visibility="collapsed")
                slider_key = f"p_{item['_id']}"
                if new_stat == "completed": st.session_state[slider_key] = 100
                
                current_prog = int(item.get('progress', 0))
                new_prog = c4.slider("", 0, 100, value=current_prog, key=slider_key, label_visibility="collapsed")
                
                with c5:
                    saved_files = item.get("files", [])
                    if not saved_files and item.get("file"): saved_files = [item["file"]] 
                    if saved_files:
                        with st.popover(f"Files ({len(saved_files)})"):
                            for f in saved_files:
                                clean_name = f.split('_', 1)[-1]
                                view_link = f"{BACKEND_URL}/view/{quote(f)}"
                                st.markdown(f'<a href="{view_link}" target="_blank">📄 {clean_name}</a>', unsafe_allow_html=True)
                    saved_links = item.get("links", [])
                    if saved_links:
                        with st.popover(f"Links ({len(saved_links)})"):
                            for l in saved_links: st.markdown(f"[{l}]({l})")
                    with st.popover("Add"):
                        new_file_uploads = st.file_uploader("Upload", accept_multiple_files=True, key=f"nf_{item['_id']}")
                        edit_links = st.text_area("Links", value="\n".join(saved_links), key=f"nl_{item['_id']}")
                        if st.button("Update", key=f"btn_up_{item['_id']}"):
                            files_payload = [("files", f) for f in new_file_uploads] if new_file_uploads else None
                            final_save_prog = 100 if new_stat == "completed" else new_prog
                            requests.put(f"{BACKEND_URL}/study/{item['_id']}", data={"status": new_stat, "progress": final_save_prog, "links": edit_links}, files=files_payload)
                            st.rerun()

                with c6: st.button("Goals", key=f"btn_goal_{item['_id']}", on_click=navigate_to_goals, args=(item,), use_container_width=True)
                with c7: 
                    if st.button("Save", key=f"u_{item['_id']}", use_container_width=True):
                        final_save_prog = 100 if new_stat == "completed" else new_prog
                        requests.put(f"{BACKEND_URL}/study/{item['_id']}", data={"status": new_stat, "progress": final_save_prog})
                        st.rerun()
                with c8: 
                    if st.button("Delete", key=f"d_{item['_id']}", use_container_width=True):
                        requests.delete(f"{BACKEND_URL}/study/{item['_id']}")
                        st.rerun()
                st.markdown("---")
        else:
            st.info("No study plans yet.")

    # --- TAB 2: GRAPHS ---
    with tab2:
        st.header("Visual Progress")
        
        if df_master.empty:
            st.info("No data available to visualize.")
        else:
            try:
                chart_type = st.selectbox(
                    "Chart Type",
                    ["Bar Chart", "Compare (Line)", "Pie Chart"],
                    key="chart_type_selector"
                )
                st.markdown("---")

                # ---------- BAR CHART ----------
                if chart_type == "Bar Chart":
                    topics = df_master["topic"].dropna().unique().tolist()
                    selected_topics = st.multiselect(
                        "Select topics (max 5)",
                        topics,
                        default=topics[:min(5, len(topics))],
                        max_selections=5
                    )
                    
                    if not selected_topics:
                        st.info("Select at least one topic.")
                    else:
                        df_f = df_master[df_master["topic"].isin(selected_topics)]
                        
                        chart = alt.Chart(df_f).mark_bar(size=45).encode(
                            x=alt.X("topic:N", title="Topic", axis=alt.Axis(labelAngle=0)),
                            y=alt.Y("progress:Q", title="Progress %", scale=alt.Scale(domain=[0, 100])),
                            color=alt.Color("topic:N", legend=None),
                            tooltip=["topic:N", "progress:Q", "status:N"]
                        ).properties(width=alt.Step(120), height=400)
                        
                        st.altair_chart(chart, use_container_width=False)

                # ---------- LINE CHART ----------
                elif chart_type == "Compare (Line)":
                    selected = st.multiselect(
                        "Select topics",
                        df_master["topic"].unique().tolist(),
                        default=df_master["topic"].unique().tolist()[:2]
                    )
                    if not selected:
                        st.info("Select at least one topic.")
                    else:
                        hdf = df_master[df_master["topic"].isin(selected)].copy()
                        now_date = datetime.now()
                        rows = []
                        for _, row in hdf.iterrows():
                            s_date = row['start_date']
                            if pd.isnull(s_date): s_date = now_date
                            rows.append({"topic": row['topic'], "date": s_date, "progress": 0})
                            rows.append({"topic": row['topic'], "date": now_date, "progress": row['progress']})
                        
                        df_line = pd.DataFrame(rows)
                        
                        chart = alt.Chart(df_line).mark_line(point=True).encode(
                            x=alt.X("date:T", title="Date", axis=alt.Axis(format="%d-%b")), 
                            y=alt.Y("progress:Q", title="Progress %", scale=alt.Scale(domain=[0, 100])),
                            color="topic:N",
                            tooltip=["topic:N", "progress:Q", alt.Tooltip("date:T", format="%Y-%m-%d")]
                        ).properties(height=400)
                        
                        st.altair_chart(chart, use_container_width=True)

                # ---------- PIE CHART ----------
                elif chart_type == "Pie Chart":
                    total = df_master["progress"].sum()
                    if total == 0:
                        st.warning("No progress data available.")
                    else:
                        df_pie = df_master.copy()
                        df_pie["percent"] = (df_pie["progress"] / total * 100).round(0)
                        df_pie["label"] = df_pie.apply(lambda x: f"{x['topic']}\n{int(x['percent'])}%" if x['percent'] >= 5 else "", axis=1)

                        pie = alt.Chart(df_pie).mark_arc(outerRadius=160).encode(
                            theta=alt.Theta("progress:Q", stack=True),
                            color=alt.Color("topic:N", legend=alt.Legend(title="Topic")),
                            tooltip=["topic:N", "progress:Q"]
                        )
                        text = alt.Chart(df_pie).mark_text(radius=110).encode(
                            theta=alt.Theta("progress:Q", stack=True),
                            text="label:N",
                            color=alt.value("white")
                        )
                        st.altair_chart(pie + text, use_container_width=True)
            except Exception as e:
                st.error(f"Chart Error: {e}")

    # --- TAB 3: JOBS ---
    with tab3:
        st.header("Job Tracker")
        with st.expander("Track Job"):
            with st.form("j", clear_on_submit=True):
                c1, c2, c3, c4 = st.columns(4)
                cmp, rol, stt = c1.text_input("Company"), c2.text_input("Role"), c3.selectbox("Status", ["Applied","Interviewing","Offer","Rejected"])
                dt = c4.date_input("Date", format="DD/MM/YYYY")
                if st.form_submit_button("Add Job"):
                    requests.post(f"{BACKEND_URL}/jobs", data={"user_email":st.session_state.user, "company":cmp, "role":rol, "status":stt, "date":str(dt)})
                    clear_job_cache()
                    st.rerun()
        try:
            data = fetch_jobs_cached(st.session_state.user)
            if data:
                scheduled = [j for j in data if j['status'] == 'Applied']
                interview = [j for j in data if j['status'] == 'Interviewing']
                offer = [j for j in data if j['status'] == 'Offer']
                rejected = [j for j in data if j['status'] == 'Rejected']

                def render_job_table(title, jobs_list, color):
                    if jobs_list:
                        st.subheader(f"{title} ({len(jobs_list)})")
                        st.markdown(f"<hr style='border-top: 3px solid {color}; margin-top: 0px;'>", unsafe_allow_html=True) 
                        cols = st.columns([2, 2, 2, 2, 1, 1])
                        for col, h in zip(cols, ["Company", "Role", "Status", "Date", "Save", "Delete"]): col.markdown(f"**{h}**")
                        for j in jobs_list:
                            c1,c2,c3,c4,c5,c6 = st.columns([2, 2, 2, 2, 1, 1], vertical_alignment="center")
                            n_cmp = c1.text_input("C", j['company'], key=f"c{j['_id']}", label_visibility="collapsed")
                            n_rol = c2.text_input("R", j['role'], key=f"r{j['_id']}", label_visibility="collapsed")
                            n_stt = c3.selectbox("S", ["Applied","Interviewing","Offer","Rejected"], index=["Applied","Interviewing","Offer","Rejected"].index(j['status']), key=f"s{j['_id']}", label_visibility="collapsed")
                            n_dt = c4.date_input("D", parse_date(j['date']), key=f"d{j['_id']}", label_visibility="collapsed", format="DD/MM/YYYY")
                            with c5: 
                                if st.button("Save", key=f"js{j['_id']}", use_container_width=True):
                                    requests.put(f"{BACKEND_URL}/jobs/{j['_id']}", data={"company":n_cmp, "role":n_rol, "status":n_stt, "date":str(n_dt)})
                                    clear_job_cache(); st.rerun()
                            with c6: 
                                if st.button("Delete", key=f"jd{j['_id']}", use_container_width=True):
                                    requests.delete(f"{BACKEND_URL}/jobs/{j['_id']}")
                                    clear_job_cache(); st.rerun()
                            st.markdown("<br>", unsafe_allow_html=True)

                render_job_table("Scheduled", scheduled, "#3498db")
                render_job_table("Interviewing", interview, "#f1c40f")
                render_job_table("Offers", offer, "#2ecc71")
                render_job_table("Rejected", rejected, "#e74c3c")
        except: pass

    # --- TAB 4: CALENDAR ---
    with tab4:
        c_head, c_ref = st.columns([5, 1])
        with c_head: st.header("Schedule")
        with c_ref:
            if st.button("🔄 Refresh"):
                clear_job_cache(); st.rerun()

        if not HAS_CALENDAR:
            st.warning("⚠️ Install calendar: `pip install streamlit-calendar`")
        
        try:
            jobs = fetch_jobs_cached(st.session_state.user)
            if jobs:
                if HAS_CALENDAR:
                    events = []
                    for j in jobs:
                        color = "#3788d8"
                        if j.get('status') == 'Interviewing': color = "#f1c40f"
                        elif j.get('status') == 'Offer': color = "#2ecc71"
                        elif j.get('status') == 'Rejected': color = "#e74c3c"
                        events.append({"title": f"{j.get('company')} ({j.get('role')})", "start": j.get('date'), "backgroundColor": color})
                    calendar(events=events, options={"initialView": "dayGridMonth"}, key="pro_calendar")
                else:
                    jobs.sort(key=lambda x: x['date'])
                    for j in jobs:
                        st.info(f"{format_date_display(j['date'])}: {j['company']} - {j['role']}")
        except: pass
        