<template><div><h1 id="interface-iwidgetexternalapi" tabindex="-1"><a class="header-anchor" href="#interface-iwidgetexternalapi" aria-hidden="true">#</a> Interface: IWidgetExternalAPI</h1>
<p>Represents the external API provided by the widget.</p>
<h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2>
<h3 id="properties" tabindex="-1"><a class="header-anchor" href="#properties" aria-hidden="true">#</a> Properties</h3>
<ul>
<li><RouterLink to="/api/interfaces/IWidgetExternalAPI.html#getconfig">getConfig</RouterLink></li>
<li><RouterLink to="/api/interfaces/IWidgetExternalAPI.html#login">login</RouterLink></li>
<li><RouterLink to="/api/interfaces/IWidgetExternalAPI.html#on">on</RouterLink></li>
<li><RouterLink to="/api/interfaces/IWidgetExternalAPI.html#setconfig">setConfig</RouterLink></li>
</ul>
<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2>
<h3 id="getconfig" tabindex="-1"><a class="header-anchor" href="#getconfig" aria-hidden="true">#</a> getConfig</h3>
<p>• <strong>getConfig</strong>: () =&gt; <code v-pre>Partial</code>&lt;<RouterLink to="/api/interfaces/IWidgetConfig.html"><code v-pre>IWidgetConfig</code></RouterLink>&gt;</p>
<h4 id="type-declaration" tabindex="-1"><a class="header-anchor" href="#type-declaration" aria-hidden="true">#</a> Type declaration</h4>
<p>▸ (): <code v-pre>Partial</code>&lt;<RouterLink to="/api/interfaces/IWidgetConfig.html"><code v-pre>IWidgetConfig</code></RouterLink>&gt;</p>
<p>Returns current widget configuration.</p>
<h5 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h5>
<p><code v-pre>Partial</code>&lt;<RouterLink to="/api/interfaces/IWidgetConfig.html"><code v-pre>IWidgetConfig</code></RouterLink>&gt;</p>
<h4 id="defined-in" tabindex="-1"><a class="header-anchor" href="#defined-in" aria-hidden="true">#</a> Defined in</h4>
<p>public-api.d.ts:95</p>
<hr>
<h3 id="login" tabindex="-1"><a class="header-anchor" href="#login" aria-hidden="true">#</a> login</h3>
<p>• <strong>login</strong>: (<code v-pre>credentials</code>: <RouterLink to="/api/interfaces/ISIPSCredentials.html"><code v-pre>ISIPSCredentials</code></RouterLink>) =&gt; <code v-pre>Promise</code>&lt;<RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink>&gt;</p>
<h4 id="type-declaration-1" tabindex="-1"><a class="header-anchor" href="#type-declaration-1" aria-hidden="true">#</a> Type declaration</h4>
<p>▸ (<code v-pre>credentials</code>): <code v-pre>Promise</code>&lt;<RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink>&gt;</p>
<p>Logs in to the SIP server.</p>
<h5 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h5>
<table>
<thead>
<tr>
<th style="text-align:left">Name</th>
<th style="text-align:left">Type</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><code v-pre>credentials</code></td>
<td style="text-align:left"><RouterLink to="/api/interfaces/ISIPSCredentials.html"><code v-pre>ISIPSCredentials</code></RouterLink></td>
</tr>
</tbody>
</table>
<h5 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h5>
<p><code v-pre>Promise</code>&lt;<RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink>&gt;</p>
<h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>
<p>public-api.d.ts:102</p>
<hr>
<h3 id="on" tabindex="-1"><a class="header-anchor" href="#on" aria-hidden="true">#</a> on</h3>
<p>• <strong>on</strong>: &lt;T&gt;(<code v-pre>type</code>: <code v-pre>T</code>, <code v-pre>listener</code>: <code v-pre>ListenerCallbackFnType</code>&lt;<code v-pre>T</code>&gt;) =&gt; <RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<h4 id="type-declaration-2" tabindex="-1"><a class="header-anchor" href="#type-declaration-2" aria-hidden="true">#</a> Type declaration</h4>
<p>▸ &lt;<code v-pre>T</code>&gt;(<code v-pre>type</code>, <code v-pre>listener</code>): <RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<p>Allows subscribing to sips events.</p>
<h5 id="type-parameters" tabindex="-1"><a class="header-anchor" href="#type-parameters" aria-hidden="true">#</a> Type parameters</h5>
<table>
<thead>
<tr>
<th style="text-align:left">Name</th>
<th style="text-align:left">Type</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><code v-pre>T</code></td>
<td style="text-align:left">extends <code v-pre>ListenersKeyType</code></td>
</tr>
</tbody>
</table>
<h5 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h5>
<table>
<thead>
<tr>
<th style="text-align:left">Name</th>
<th style="text-align:left">Type</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><code v-pre>type</code></td>
<td style="text-align:left"><code v-pre>T</code></td>
<td style="text-align:left">type of event, check ListenersKeyType</td>
</tr>
<tr>
<td style="text-align:left"><code v-pre>listener</code></td>
<td style="text-align:left"><code v-pre>ListenerCallbackFnType</code>&lt;<code v-pre>T</code>&gt;</td>
<td style="text-align:left">the event listener, check ListenerCallbackFnType of provided event</td>
</tr>
</tbody>
</table>
<h5 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h5>
<p><RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4>
<p>public-api.d.ts:83</p>
<hr>
<h3 id="setconfig" tabindex="-1"><a class="header-anchor" href="#setconfig" aria-hidden="true">#</a> setConfig</h3>
<p>• <strong>setConfig</strong>: (<code v-pre>config</code>: <code v-pre>Partial</code>&lt;<RouterLink to="/api/interfaces/IWidgetConfig.html"><code v-pre>IWidgetConfig</code></RouterLink>&gt;) =&gt; <RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<h4 id="type-declaration-3" tabindex="-1"><a class="header-anchor" href="#type-declaration-3" aria-hidden="true">#</a> Type declaration</h4>
<p>▸ (<code v-pre>config</code>): <RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<p>Changes the widget configuration.</p>
<h5 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h5>
<table>
<thead>
<tr>
<th style="text-align:left">Name</th>
<th style="text-align:left">Type</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><code v-pre>config</code></td>
<td style="text-align:left"><code v-pre>Partial</code>&lt;<RouterLink to="/api/interfaces/IWidgetConfig.html"><code v-pre>IWidgetConfig</code></RouterLink>&gt;</td>
</tr>
</tbody>
</table>
<h5 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h5>
<p><RouterLink to="/api/interfaces/IWidgetExternalAPI.html"><code v-pre>IWidgetExternalAPI</code></RouterLink></p>
<h4 id="defined-in-3" tabindex="-1"><a class="header-anchor" href="#defined-in-3" aria-hidden="true">#</a> Defined in</h4>
<p>public-api.d.ts:90</p>
</div></template>


