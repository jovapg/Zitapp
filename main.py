import pandas as pd
from sqlalchemy import create_engine
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import base64
from io import BytesIO
import warnings
warnings.filterwarnings('ignore')

# Configurar estilo de seaborn
sns.set_style("whitegrid")
sns.set_palette("husl")

class HTMLReportGenerator:
    def __init__(self, data):
        self.data = data
        self.charts = {}
        self.html_content = ""
        
    # Genera una figura en memoria
    def plot_to_base64(self, fig):
        buffer = BytesIO()
        fig.savefig(buffer, format='png', bbox_inches='tight', dpi=150, facecolor='white')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        buffer.close()
        plt.close(fig)
        return f"data:image/png;base64,{image_base64}"
    
    def create_appointments_charts(self):
        if 'appointments' not in self.data or self.data['appointments'].empty:
            return
            
        df = self.data['appointments'].copy()
        
        df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')
        df['mes'] = df['fecha'].dt.month
        df['dia_semana'] = df['fecha'].dt.day_name()
        df['hora_num'] = pd.to_datetime(df['hora'], format='%H:%M:%S', errors='coerce').dt.hour
        
        # Gráfico 1: Estados de citas
        fig, ax = plt.subplots(1, 2, figsize=(15, 6))
        
        # Pie chart de estados
        estados_count = df['estado'].value_counts()
        colors = sns.color_palette("Set2", len(estados_count))
        ax[0].pie(estados_count.values, labels=estados_count.index, autopct='%1.1f%%', 
                 colors=colors, startangle=90)
        ax[0].set_title('Distribución de Estados de Citas', fontsize=14, fontweight='bold')
        
        # Bar chart de citas por día de la semana
        dias_orden = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        citas_dia = df['dia_semana'].value_counts().reindex(dias_orden, fill_value=0)
        sns.barplot(x=citas_dia.index, y=citas_dia.values, ax=ax[1], palette="viridis")
        ax[1].set_title('Citas por Día de la Semana', fontsize=14, fontweight='bold')
        ax[1].set_xlabel('Día de la Semana')
        ax[1].set_ylabel('Número de Citas')
        ax[1].tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        self.charts['appointments_overview'] = self.plot_to_base64(fig)
        
        # Gráfico 2: Distribución por horas y tendencia mensual
        fig, ax = plt.subplots(1, 2, figsize=(15, 6))
        
        plt.tight_layout()
        self.charts['appointments_detailed'] = self.plot_to_base64(fig)
    
    def create_business_charts(self):
        """Crear gráficos de análisis de negocios"""
        if 'businesses' not in self.data or self.data['businesses'].empty:
            return
            
        df_businesses = self.data['businesses'].copy()
        df_appointments = self.data['appointments'].copy()
        df_services = self.data['services'].copy()
        
        fig, ax = plt.subplots(2, 2, figsize=(16, 12))
        
        # Gráfico 1: Categorías de negocios
        if 'categoria' in df_businesses.columns:
            categorias = df_businesses['categoria'].value_counts().head(10)
            sns.barplot(y=categorias.index, x=categorias.values, ax=ax[0,0], palette="Set1")
            ax[0,0].set_title('Top 10 Categorías de Negocios', fontsize=14, fontweight='bold')
            ax[0,0].set_xlabel('Cantidad de Negocios')
        
        # Gráfico 2: Citas por negocio (top 10)
        if not df_appointments.empty:
            citas_negocio = df_appointments['id_negocio'].value_counts().head(10)
            sns.barplot(x=citas_negocio.values, y=citas_negocio.index, ax=ax[0,1], palette="viridis")
            ax[0,1].set_title('Top 10 Negocios por Número de Citas', fontsize=14, fontweight='bold')
            ax[0,1].set_xlabel('Número de Citas')
        
        # Gráfico 3: Distribución de precios de servicios
        # if not df_services.empty and 'precio' in df_services.columns:
        #     precios = df_services['precio'].dropna()
        #     if len(precios) > 0:
        #         sns.histplot(precios, bins=20, ax=ax[1,0], color='skyblue', alpha=0.7)
        #         ax[1,0].set_title('Distribución de Precios de Servicios', fontsize=14, fontweight='bold')
        #         ax[1,0].set_xlabel('Precio')
        #         ax[1,0].set_ylabel('Frecuencia')
        
        # Gráfico 4: Duración promedio de servicios
        if not df_services.empty and 'duracion' in df_services.columns:
            duraciones = df_services['duracion'].dropna()
            if len(duraciones) > 0:
                sns.boxplot(y=duraciones, ax=ax[1,1], color='lightgreen')
                ax[1,1].set_title('Duración de Servicios (Distribución)', fontsize=14, fontweight='bold')
                ax[1,1].set_ylabel('Duración (minutos)')
        
        plt.tight_layout()
        self.charts['business_analysis'] = self.plot_to_base64(fig)
    
    def create_user_charts(self):
        """Crear gráficos de análisis de usuarios"""
        if 'users' not in self.data or self.data['users'].empty:
            return
            
        df_users = self.data['users'].copy()
        df_appointments = self.data['appointments'].copy()
        
        fig, ax = plt.subplots(1, 3, figsize=(18, 6))
        
        # Gráfico 1: Segmentación de usuarios
        if not df_appointments.empty:
            citas_por_usuario = df_appointments.groupby('id_cliente').size()
            
            def segmentar_usuario(num_citas):
                if num_citas >= 10:
                    return 'Premium (10+)'
                elif num_citas >= 5:
                    return 'Regular (5-9)'
                elif num_citas >= 2:
                    return 'Ocasional (2-4)'
                else:
                    return 'Nuevo (1)'
            
            segmentacion = citas_por_usuario.apply(segmentar_usuario).value_counts()
            colors = sns.color_palette("Set3", len(segmentacion))
            ax[0].pie(segmentacion.values, labels=segmentacion.index, autopct='%1.1f%%', 
                     colors=colors, startangle=90)
            ax[0].set_title('Segmentación de Usuarios\n(por Número de Citas)', fontsize=14, fontweight='bold')
        
        # Gráfico 2: Distribución de citas por usuario
        if not df_appointments.empty:
            sns.histplot(citas_por_usuario, bins=20, ax=ax[1], color='coral', alpha=0.7)
            ax[1].set_title('Distribución de Citas por Usuario', fontsize=14, fontweight='bold')
            ax[1].set_xlabel('Número de Citas')
            ax[1].set_ylabel('Cantidad de Usuarios')
        
        # Gráfico 3: Usuarios activos vs totales
        usuarios_activos = df_appointments['id_cliente'].nunique() if not df_appointments.empty else 0
        total_usuarios = len(df_users)
        usuarios_inactivos = total_usuarios - usuarios_activos
        
        labels = ['Usuarios Activos', 'Usuarios Inactivos']
        sizes = [usuarios_activos, usuarios_inactivos]
        colors = ['#2ecc71', '#e74c3c']
        
        ax[2].pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=90)
        ax[2].set_title('Usuarios Activos vs Inactivos', fontsize=14, fontweight='bold')
        
        plt.tight_layout()
        self.charts['user_analysis'] = self.plot_to_base64(fig)
    
    def create_kpi_summary(self):
        """Crear resumen de KPIs"""
        kpis = {}
        
        # KPIs de citas
        if 'appointments' in self.data and not self.data['appointments'].empty:
            df_appointments = self.data['appointments']
            kpis['total_citas'] = len(df_appointments)
            kpis['estados_citas'] = df_appointments['estado'].value_counts().to_dict()
            
            # Tasa de conversión (asumiendo que 'completada' es el estado exitoso)
            if 'completada' in df_appointments['estado'].values:
                completadas = len(df_appointments[df_appointments['estado'] == 'completada'])
                kpis['tasa_conversion'] = (completadas / len(df_appointments) * 100) if len(df_appointments) > 0 else 0
            else:
                kpis['tasa_conversion'] = 0
        
        # KPIs de usuarios
        if 'users' in self.data and not self.data['users'].empty:
            kpis['total_usuarios'] = len(self.data['users'])
            if 'appointments' in self.data and not self.data['appointments'].empty:
                kpis['usuarios_activos'] = self.data['appointments']['id_cliente'].nunique()
                kpis['tasa_actividad'] = (kpis['usuarios_activos'] / kpis['total_usuarios'] * 100) if kpis['total_usuarios'] > 0 else 0
        
        # KPIs de negocios
        if 'businesses' in self.data and not self.data['businesses'].empty:
            kpis['total_negocios'] = len(self.data['businesses'])
        
        # KPIs de servicios
        if 'services' in self.data and not self.data['services'].empty:
            kpis['total_servicios'] = len(self.data['services'])
            if 'precio' in self.data['services'].columns:
                precios = self.data['services']['precio'].dropna()
                if len(precios) > 0:
                    kpis['precio_promedio'] = precios.mean()
                    kpis['precio_mediano'] = precios.median()
        
        return kpis
    
    def generate_html_report(self):
        """Generar el reporte HTML completo"""
        
        # Crear todos los gráficos
        print("📊 Generando gráficos con Seaborn...")
        self.create_appointments_charts()
        self.create_business_charts()
        self.create_user_charts()
        
        # Obtener KPIs
        kpis = self.create_kpi_summary()
        
        # Template HTML
        html_template = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Análisis - Zitapp</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }}
        .header p {{
            margin: 10px 0 0 0;
            font-size: 1.1em;
            opacity: 0.9;
        }}
        .kpi-section {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background-color: #f8f9fa;
        }}
        .kpi-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }}
        .kpi-value {{
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }}
        .kpi-label {{
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .section {{
            padding: 30px;
            border-bottom: 1px solid #eee;
        }}
        .section:last-child {{
            border-bottom: none;
        }}
        .section h2 {{
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            font-weight: 400;
        }}
        .chart-container {{
            text-align: center;
            margin: 20px 0;
        }}
        .chart-container img {{
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }}
        .footer {{
            background-color: #333;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }}
        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }}
        .metric-item {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #28a745;
        }}
        .metric-item strong {{
            color: #333;
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 Reporte de Análisis Zitapp</h1>
            <p>Dashboard de métricas y análisis de datos</p>
            <p>Generado el: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
        </div>
        
        <!-- KPIs Section -->
        <div class="kpi-section">
            <div class="kpi-card">
                <div class="kpi-value">{kpis.get('total_citas', 0):,}</div>
                <div class="kpi-label">Total Citas</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">{kpis.get('total_usuarios', 0):,}</div>
                <div class="kpi-label">Total Usuarios</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">{kpis.get('usuarios_activos', 0):,}</div>
                <div class="kpi-label">Usuarios Activos</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">{kpis.get('total_negocios', 0):,}</div>
                <div class="kpi-label">Total Negocios</div>
            </div>
        </div>
        
        <!-- Análisis de Citas -->
        <div class="section">
            <h2>🗓️ Análisis de Citas</h2>
            <p>Patrones y tendencias en las citas programadas</p>
            {f'<div class="chart-container"><img src="{self.charts["appointments_overview"]}" alt="Análisis General de Citas"></div>' if 'appointments_overview' in self.charts else '<p>No hay datos de citas disponibles</p>'}
        </div>
        
        <!-- Análisis de Negocios -->
        <div class="section">
            <h2>🏢 Análisis de Negocios</h2>
            <p>Rendimiento y categorización de negocios registrados</p>
            {f'<div class="chart-container"><img src="{self.charts["business_analysis"]}" alt="Análisis de Negocios"></div>' if 'business_analysis' in self.charts else '<p>No hay datos de negocios disponibles</p>'}
        </div>
        
        <!-- Análisis de Usuarios -->
        <div class="section">
            <h2>👥 Análisis de Usuarios</h2>
            <p>Comportamiento y segmentación de usuarios</p>
            {f'<div class="chart-container"><img src="{self.charts["user_analysis"]}" alt="Análisis de Usuarios"></div>' if 'user_analysis' in self.charts else '<p>No hay datos de usuarios disponibles</p>'}
        </div>
        
        <!-- Métricas Adicionales -->
        <div class="section">
            <h2>📈 Métricas Adicionales</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <strong>Estados de Citas:</strong><br>
                    {', '.join([f'{k}: {v}' for k, v in kpis.get('estados_citas', {}).items()]) if kpis.get('estados_citas') else 'No disponible'}
                </div>
                <div class="metric-item">
                    <strong>Precio Promedio de Servicios:</strong><br>
                    ${kpis.get('precio_promedio', 0):.2f} COP
                </div>
                <div class="metric-item">
                    <strong>Total de Servicios:</strong><br>
                    {kpis.get('total_servicios', 0):,} servicios registrados
                </div>
                <div class="metric-item">
                    <strong>Precio Mediano:</strong><br>
                    ${kpis.get('precio_mediano', 0):.2f} COP
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>© 2025 Zitapp Analytics Dashboard | Generado automáticamente con Python & Seaborn</p>
        </div>
    </div>
</body>
</html>
        """
        
        return html_template

# =============================================================================
# CLASE PRINCIPAL PARA CONECTAR Y GENERAR REPORTE
# =============================================================================

class ZitappReportGenerator:
    def __init__(self):
        self.host = 'localhost'
        self.port = 3306
        self.database = 'Zitapp'
        self.username = 'root'
        self.password = 'root'
        self.engine = None
        self.data = {}
    
    def connect_to_database(self):
        """Conectar a MySQL"""
        try:
            connection_string = f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
            self.engine = create_engine(connection_string)
            
            # Test connection
            with self.engine.connect() as conn:
                pass
            
            print("✅ Conexión exitosa a la base de datos")
            return True
            
        except Exception as e:
            print(f"❌ Error al conectar: {e}")
            return False
    
    def load_data(self):
        """Cargar datos de todas las tablas"""
        try:
            print("📊 Cargando datos...")
            
            tables = ['appointments', 'businesses', 'users', 'services', 'availability', 'notifications']
            
            for table in tables:
                try:
                    self.data[table] = pd.read_sql(f"SELECT * FROM {table}", self.engine)
                    print(f"   ✓ {table}: {len(self.data[table])} registros")
                except Exception as e:
                    print(f"   ⚠️ {table}: No se pudo cargar - {e}")
                    self.data[table] = pd.DataFrame()
            
            return True
            
        except Exception as e:
            print(f"❌ Error al cargar datos: {e}")
            return False
    
    def generate_report(self, output_file="zitapp_report.html"):
        try:
            if not self.connect_to_database():
                return False
            
            if not self.load_data():
                return False
            
            report_generator = HTMLReportGenerator(self.data)
            html_content = report_generator.generate_html_report()
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ Reporte generado exitosamente: {output_file}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error al generar reporte: {e}")
            return False
        
        finally:
            if self.engine:
                self.engine.dispose()

def main():
    print("Generador de Reporte HTML - Zitapp")
    print("=" * 50)
    
    generator = ZitappReportGenerator()
    success = generator.generate_report("zitapp_dashboard.html")
    
    if success:
        print("\n¡Reporte generado exitosamente!")
        print("Archivo: zitapp_dashboard.html")
    else:
        print("\n❌ No se pudo generar el reporte")

if __name__ == "__main__":
    main()