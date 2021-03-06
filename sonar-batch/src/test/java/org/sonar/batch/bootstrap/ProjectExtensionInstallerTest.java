/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2008-2012 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.batch.bootstrap;

import com.google.common.collect.Maps;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.maven.project.MavenProject;
import org.junit.Test;
import org.sonar.api.*;
import org.sonar.api.batch.CoverageExtension;
import org.sonar.api.batch.InstantiationStrategy;
import org.sonar.api.batch.SupportedEnvironment;
import org.sonar.api.config.Settings;
import org.sonar.api.resources.Java;
import org.sonar.api.resources.Project;
import org.sonar.batch.bootstrapper.EnvironmentInformation;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ProjectExtensionInstallerTest {

  @Test
  public void shouldBeMavenExtensionOnEmulatedMavenProject() {
    Project mavenProject = new Project("foo").setPom(new MavenProject());
    Project otherProject = new Project("bar");
    assertThat(ProjectExtensionInstaller.isMavenExtensionOnEmulatedMavenProject(MavenService.class, mavenProject), is(false));
    assertThat(ProjectExtensionInstaller.isMavenExtensionOnEmulatedMavenProject(MavenService.class, otherProject), is(true));

    // this service is not for Maven only
    assertThat(ProjectExtensionInstaller.isMavenExtensionOnEmulatedMavenProject(BuildToolService.class, mavenProject), is(false));
    assertThat(ProjectExtensionInstaller.isMavenExtensionOnEmulatedMavenProject(BuildToolService.class, otherProject), is(false));
  }

  @Test
  public void shouldInstallExtensionsWithProjectInstantiationStrategy() {
    BatchPluginRepository pluginRepository = mock(BatchPluginRepository.class);
    Map<String, Plugin> pluginsMap = Maps.newHashMap();
    pluginsMap.put("fooPlugin", new SonarPlugin() {
      public List getExtensions() {
        return Arrays.asList(BatchService.class, ProjectService.class, ServerService.class);
      }
    });
    when(pluginRepository.getPluginsByKey()).thenReturn(pluginsMap);
    Module module = new FakeModule().init();
    ProjectExtensionInstaller installer = new ProjectExtensionInstaller(pluginRepository, new EnvironmentInformation("ant", "1.7"), new DryRun(false), new Project("foo"), null);

    installer.install(module);

    assertThat(module.getComponentByType(BatchService.class), nullValue());
    assertThat(module.getComponentByType(ProjectService.class), not(nullValue()));
    assertThat(module.getComponentByType(ServerService.class), nullValue());
  }

  @Test
  public void shouldNotInstallPluginsOnNonSupportedEnvironment() {
    BatchPluginRepository pluginRepository = mock(BatchPluginRepository.class);
    Map<String, Plugin> pluginsMap = Maps.newHashMap();
    pluginsMap.put("fooPlugin", new SonarPlugin() {
      public List getExtensions() {
        return Arrays.asList(MavenService.class, BuildToolService.class);
      }
    });
    when(pluginRepository.getPluginsByKey()).thenReturn(pluginsMap);
    Module module = new FakeModule().init();
    ProjectExtensionInstaller installer = new ProjectExtensionInstaller(pluginRepository, new EnvironmentInformation("ant", "1.7"), new DryRun(false), new Project("foo"), null);

    installer.install(module);

    assertThat(module.getComponentByType(MavenService.class), nullValue());
    assertThat(module.getComponentByType(BuildToolService.class), not(nullValue()));
  }

  private static Project newJavaProject() {
    Project project = new Project("foo").setLanguageKey(Java.KEY).setAnalysisType(Project.AnalysisType.DYNAMIC);
    return project;
  }

  private static Project newGroovyProject() {
    return new Project("foo").setLanguageKey("grvy").setAnalysisType(Project.AnalysisType.DYNAMIC);
  }

  @Test
  public void shouldRegisterCustomCoverageExtension() {
    Settings conf = new Settings();
    conf.setProperty(CoreProperties.CORE_COVERAGE_PLUGIN_PROPERTY, "clover,phpunit");

    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "cobertura", newJavaProject(), conf), is(true));
    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "clover", newJavaProject(), conf), is(false));
    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "phpunit", newJavaProject(), conf), is(false));
    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "other", newJavaProject(), conf), is(true));
  }

  @Test
  public void shouldNotCheckCoverageExtensionsOnNonJavaProjects() {
    Settings conf = new Settings();
    conf.setProperty(CoreProperties.CORE_COVERAGE_PLUGIN_PROPERTY, "cobertura");

    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "groovy", newGroovyProject(), conf), is(false));
    assertThat(ProjectExtensionInstaller.isDeactivatedCoverageExtension(FakeCoverageExtension.class, "groovy", newJavaProject(), conf), is(true));

  }


  @SupportedEnvironment("maven")
  public static class MavenService implements BatchExtension {

  }

  @SupportedEnvironment({"maven", "ant", "gradle"})
  public static class BuildToolService implements BatchExtension {

  }

  @InstantiationStrategy(InstantiationStrategy.PER_BATCH)
  public static class BatchService implements BatchExtension {

  }

  public static class ProjectService implements BatchExtension {

  }

  public static class ServerService implements ServerExtension {

  }

  public static class FakeCoverageExtension implements CoverageExtension {

  }

  public static class FakeModule extends Module {
    @Override
    protected void configure() {
    }
  }
}
